"use client";

import * as React from "react";
import Link from "next/link";
import { Terminal, Menu, X, Command } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

export function Header({ onOpenCommandPalette }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: "01.ABOUT", href: "#about" },
    { label: "02.SKILLS", href: "#skills" },
    { label: "03.PROJECTS", href: "#projects" },
    { label: "04.PIPELINE", href: "#pipeline" },
    { label: "05.ACTIVITY", href: "#activity" },
    { label: "06.TIMELINE", href: "#timeline" },
    { label: "07.BLOG", href: "#blog" },
    { label: "08.CONTACT", href: "#contact" },
  ];

  const triggerCommandPalette = () => {
    if (onOpenCommandPalette) {
      onOpenCommandPalette();
    } else {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Telemetry Indicator */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="group flex items-center space-x-2 text-foreground font-mono font-bold tracking-tight text-sm hover:text-accent-emerald transition-colors"
            >
              <div className="w-8 h-8 rounded border border-border bg-surface flex items-center justify-center text-accent-emerald group-hover:border-accent-emerald transition-colors">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">shuvo@infra:~$</span>
              <span className="sm:hidden">shuvo.dev</span>
            </Link>

            {/* Telemetry Status Badge */}
            <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-mono border border-border bg-surface/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
              </span>
              <span className="text-muted tracking-wider text-[11px]">SYS: NOMINAL</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 font-mono text-xs">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-2.5 py-1.5 rounded text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right actions: Command Palette trigger, Theme toggle, Mobile Menu toggle */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={triggerCommandPalette}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md border border-border bg-surface text-muted text-xs font-mono hover:bg-surface-hover hover:text-foreground transition-colors"
              title="Open Command Palette (Ctrl+K or ⌘K)"
            >
              <Command className="w-3.5 h-3.5 text-accent-cyan" />
              <span className="hidden sm:inline">Cmd</span>
              <kbd className="hidden sm:inline px-1 py-0.5 rounded bg-surface-elevated text-[10px] text-foreground font-mono">
                K
              </kbd>
            </button>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md border border-border bg-surface text-muted hover:text-foreground transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-surface/95 px-4 pt-2 pb-6 space-y-1 font-mono text-xs">
          <div className="py-2 mb-2 border-b border-border/50 flex items-center justify-between text-muted">
            <span className="text-[11px]">TELEMETRY: HOST_AVAILABLE</span>
            <span className="text-accent-emerald text-[11px] font-bold">PORT: 443</span>
          </div>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-foreground hover:bg-surface-elevated hover:text-accent-emerald transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
