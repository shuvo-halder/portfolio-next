import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/layout/CommandPalette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shuvo Halder | DevOps Engineer & System Administrator",
  description:
    "Production-grade infrastructure, Linux systems automation, hardened reverse proxy topologies, and resilient DevOps engineering by Shuvo Halder.",
  keywords: [
    "Shuvo Halder",
    "DevOps Engineer",
    "System Engineer",
    "System Administrator",
    "Linux",
    "Nginx",
    "Apache",
    "Docker",
    "Certbot",
    "Bash Automation",
    "BinRecon Corp",
  ],
  authors: [{ name: "Shuvo Halder", url: "https://github.com/shuvo-halder" }],
  creator: "Shuvo Halder",
  metadataBase: new URL("https://shuvohalder.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shuvohalder.dev",
    title: "Shuvo Halder | DevOps Engineer & System Administrator",
    description:
      "Deterministic infrastructure, Linux systems automation, and hardened DevOps topologies.",
    siteName: "Shuvo Halder Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shuvo Halder | DevOps Engineer & System Administrator",
    description:
      "Deterministic infrastructure, Linux systems automation, and hardened DevOps topologies.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://shuvohalder.dev/#person",
      name: "Shuvo Halder",
      jobTitle: "DevOps Engineer & System Administrator",
      url: "https://shuvohalder.dev",
      sameAs: [
        "https://github.com/shuvo-halder",
        "https://www.linkedin.com/in/shuvo-halder/",
        "https://dev.to/shuvo_h",
        "https://hackerrank.com/profile/shuvohalder_1331",
        "https://huggingface.co/shuvo-halder",
      ],
      worksFor: {
        "@type": "Organization",
        name: "BinRecon Corp.",
        url: "https://binrecon.io",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://shuvohalder.dev/#website",
      url: "https://shuvohalder.dev",
      name: "Shuvo Halder Portfolio",
      publisher: {
        "@id": "https://shuvohalder.dev/#person",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground bg-grid-pattern">
        {/* Accessibility Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-accent-emerald text-background font-mono font-bold text-xs rounded shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CommandPalette />
          <Header />
          <main id="main-content" className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
