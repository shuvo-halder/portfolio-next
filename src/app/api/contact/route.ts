import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db/client";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Invalid email address"),
  subject: z.string().trim().min(2, "Subject must be at least 2 characters").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
  website_hp: z.string().optional(), // Honeypot field
});

export async function POST(req: NextRequest) {
  try {
    // 1. IP resolution & rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(ip, 3, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait 10 minutes before submitting another message.",
        },
        { status: 429 }
      );
    }

    // 2. Parse & validate body
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, website_hp } = result.data;

    // 3. Honeypot check: silently drop automated bots
    if (website_hp && website_hp.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Message processed successfully.",
      });
    }

    // Persist into PostgreSQL ContactMessage table
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") || undefined,
      },
    }).catch((err) => console.warn("ContactMessage DB insert error:", err));

    // 4. Dispatch Email if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "portfolio@shuvohalder.dev",
          to: process.env.CONTACT_TO_EMAIL || "shuvo-halder@outlook.com",
          reply_to: email,
          subject: `[DevOps Portfolio Contact] ${subject} from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }),
      });

      if (!resendRes.ok) {
        console.error("Resend API dispatch failed:", await resendRes.text());
        return NextResponse.json(
          { error: "Failed to dispatch email. Please reach out directly to shuvo-halder@outlook.com." },
          { status: 500 }
        );
      }
    } else {
      // Safe development / fallback logging
      console.log("[CONTACT_FORM_SUBMISSION]", {
        timestamp: new Date().toISOString(),
        name,
        email,
        subject,
        messageLength: message.length,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Message delivered successfully. I will get back to you shortly.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing message." },
      { status: 500 }
    );
  }
}
