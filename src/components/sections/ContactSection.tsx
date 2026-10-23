"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send, Copy, Check, ExternalLink, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { profileData } from "@/data/content";
import { Icons } from "@/components/ui/Icons";

const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  subject: z.string().trim().min(2, "Subject must be at least 2 characters").max(120, "Subject is too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message cannot exceed 2000 characters"),
  website_hp: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactSection() {
  const [copied, setCopied] = React.useState(false);
  const [serverStatus, setServerStatus] = React.useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website_hp: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setServerStatus({ type: null, message: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerStatus({
          type: "error",
          message: json.error || "Failed to dispatch message. Please email directly.",
        });
        return;
      }

      setServerStatus({
        type: "success",
        message: "Message received into system inbox! I will review and reply promptly.",
      });
      reset();
    } catch {
      setServerStatus({
        type: "error",
        message: "Network or server connection failed. Please contact via direct email.",
      });
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profileData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-border/80 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-emerald uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent-emerald" />
            <span>{"// 08. INITIALIZE_COMMUNICATION"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
            Contact & Operational Dispatch
          </h2>
          <p className="text-sm sm:text-base text-muted font-mono max-w-2xl">
            Reach out regarding infrastructure engineering, automation pipelines, systems administration roles,
            or open-source collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono">
          {/* Left Column: Direct Credentials & Status (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Availability Badge */}
            <div className="p-5 rounded-xl border border-accent-emerald/40 bg-accent-emerald/10 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-accent-emerald font-bold">
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                <span>SYSTEM_STATUS: AVAILABLE_FOR_HIRE</span>
              </div>
              <p className="text-xs text-muted font-sans leading-relaxed">
                Currently open to DevOps Engineer, System Administrator, and Site Reliability roles.
              </p>
            </div>

            {/* Direct Connect Box */}
            <div className="p-6 rounded-xl border border-border bg-surface space-y-4">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                {"// DIRECT_TELEMETRY_CHANNELS"}
              </span>

              {/* Email Copy Card */}
              <div className="p-3 rounded-lg border border-border/80 bg-surface-elevated flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5 truncate mr-2">
                  <Mail className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span className="text-foreground truncate">{profileData.email}</span>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="px-2.5 py-1 rounded border border-border bg-surface hover:text-accent-emerald hover:border-accent-emerald text-[11px] font-semibold transition-colors shrink-0 flex items-center space-x-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-accent-emerald" />
                      <span className="text-accent-emerald">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Social Channels */}
              <div className="space-y-2 text-xs">
                <a
                  href={profileData.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-lg border border-border/80 bg-surface-elevated hover:border-accent-cyan flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icons.linkedin className="w-4 h-4 text-accent-cyan" />
                    <span className="text-foreground">LinkedIn Network</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-accent-cyan transition-colors" />
                </a>

                <a
                  href={profileData.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-lg border border-border/80 bg-surface-elevated hover:border-accent-emerald flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icons.github className="w-4 h-4 text-accent-emerald" />
                    <span className="text-foreground">GitHub Profile (88 Repos)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-accent-emerald transition-colors" />
                </a>
              </div>
            </div>

            {/* Security Hardening Note */}
            <div className="p-4 rounded-lg border border-border bg-surface/50 text-xs text-muted flex items-start space-x-3">
              <ShieldCheck className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed font-sans">
                Submissions are rate-limited per IP, sanitised via strict Zod schemas, and protected with a silent honeypot against automated spam bots.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-xl border border-border bg-surface space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                {"// TRANSMIT_ENCRYPTED_MESSAGE"}
              </span>
              <span className="text-[11px] text-accent-emerald">PORT: 443(HTTPS)</span>
            </div>

            {/* Server Status Banners */}
            {serverStatus.type === "success" && (
              <div className="p-3.5 rounded-lg border border-accent-emerald/40 bg-accent-emerald/10 text-accent-emerald text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{serverStatus.message}</span>
              </div>
            )}

            {serverStatus.type === "error" && (
              <div className="p-3.5 rounded-lg border border-accent-red/40 bg-accent-red/10 text-accent-red text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-mono">
              {/* Honeypot field (hidden from legitimate users) */}
              <input
                type="text"
                {...register("website_hp")}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-muted text-[11px] uppercase tracking-wider block">
                    NAME / IDENTITY *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="e.g. Linus Torvalds"
                    {...register("name")}
                    className={`w-full px-3.5 py-2.5 rounded-md border bg-surface-elevated text-foreground outline-none transition-colors ${
                      errors.name
                        ? "border-accent-red focus:border-accent-red"
                        : "border-border focus:border-accent-emerald"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-accent-red text-[11px]">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-muted text-[11px] uppercase tracking-wider block">
                    RETURN EMAIL ADDRESS *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="e.g. user@domain.com"
                    {...register("email")}
                    className={`w-full px-3.5 py-2.5 rounded-md border bg-surface-elevated text-foreground outline-none transition-colors ${
                      errors.email
                        ? "border-accent-red focus:border-accent-red"
                        : "border-border focus:border-accent-emerald"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-accent-red text-[11px]">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-muted text-[11px] uppercase tracking-wider block">
                  TRANSMISSION SUBJECT *
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="e.g. Infrastructure Engineering Role / Open Source Project"
                  {...register("subject")}
                  className={`w-full px-3.5 py-2.5 rounded-md border bg-surface-elevated text-foreground outline-none transition-colors ${
                    errors.subject
                      ? "border-accent-red focus:border-accent-red"
                      : "border-border focus:border-accent-emerald"
                  }`}
                />
                {errors.subject && (
                  <p className="text-accent-red text-[11px]">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-muted text-[11px] uppercase tracking-wider block">
                  PAYLOAD / MESSAGE (10-2000 CHARACTERS) *
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="State your technical inquiry, project requirements, or infrastructure questions..."
                  {...register("message")}
                  className={`w-full px-3.5 py-2.5 rounded-md border bg-surface-elevated text-foreground outline-none transition-colors font-sans text-xs ${
                    errors.message
                      ? "border-accent-red focus:border-accent-red"
                      : "border-border focus:border-accent-emerald"
                  }`}
                />
                {errors.message && (
                  <p className="text-accent-red text-[11px]">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-md bg-accent-emerald text-background font-bold hover:bg-accent-emerald/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-accent-emerald/20 text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>DISPATCHING_PAYLOAD...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>TRANSMIT_MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
