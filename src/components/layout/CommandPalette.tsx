"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Search,
  Terminal,
  ExternalLink,
  Sun,
  Moon,
  Copy,
  Check,
  FolderGit2,
  Cpu,
  Layers,
  Sparkles,
  Mail,
  X,
} from "lucide-react";
import { featuredProjects } from "@/data/projects";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Projects" | "Actions" | "Links";
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const openPalette = React.useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const closePalette = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  // Listen to keyboard shortcut (Cmd+K / Ctrl+K) and custom open event
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            setTimeout(() => inputRef.current?.focus(), 50);
            return true;
          }
          return false;
        });
      }
      if (e.key === "Escape") {
        closePalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", openPalette);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", openPalette);
    };
  }, [openPalette, closePalette]);

  const copyEmail = React.useCallback(() => {
    navigator.clipboard.writeText("shuvo-halder@outlook.com");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      closePalette();
    }, 1200);
  }, [closePalette]);

  // Build items list
  const items: CommandItem[] = React.useMemo(() => {
    const list: CommandItem[] = [
      // Sections
      {
        id: "nav-about",
        title: "Go to About",
        subtitle: "Background, philosophy, and education",
        category: "Navigation",
        icon: Terminal,
        action: () => {
          router.push("#about");
          closePalette();
        },
      },
      {
        id: "nav-skills",
        title: "Go to Skills & Toolbox",
        subtitle: "Linux, Web servers, Docker, CI/CD",
        category: "Navigation",
        icon: Cpu,
        action: () => {
          router.push("#skills");
          closePalette();
        },
      },
      {
        id: "nav-projects",
        title: "Go to Projects",
        subtitle: "Featured production repositories",
        category: "Navigation",
        icon: FolderGit2,
        action: () => {
          router.push("#projects");
          closePalette();
        },
      },
      {
        id: "nav-pipeline",
        title: "Go to CI/CD Pipeline",
        subtitle: "Animated architecture flow",
        category: "Navigation",
        icon: Layers,
        action: () => {
          router.push("#pipeline");
          closePalette();
        },
      },
      {
        id: "nav-activity",
        title: "Go to GitHub Activity",
        subtitle: "Live repository statistics and language distribution",
        category: "Navigation",
        icon: Sparkles,
        action: () => {
          router.push("#activity");
          closePalette();
        },
      },
      {
        id: "nav-contact",
        title: "Go to Contact",
        subtitle: "Direct message and verified credentials",
        category: "Navigation",
        icon: Mail,
        action: () => {
          router.push("#contact");
          closePalette();
        },
      },

      // Actions
      {
        id: "action-theme",
        title: `Toggle Theme (current: ${theme || "dark"})`,
        subtitle: "Switch between dark and light mode",
        category: "Actions",
        icon: theme === "dark" ? Sun : Moon,
        action: () => {
          setTheme(theme === "dark" ? "light" : "dark");
          closePalette();
        },
      },
      {
        id: "action-copy-email",
        title: copied ? "Email Copied!" : "Copy Email Address",
        subtitle: "shuvo-halder@outlook.com",
        category: "Actions",
        icon: copied ? Check : Copy,
        action: copyEmail,
      },

      // Featured Project Deep Dives
      ...featuredProjects.map((p) => ({
        id: `project-${p.slug}`,
        title: `Project: ${p.title}`,
        subtitle: `${p.language} · ${p.tagline}`,
        category: "Projects" as const,
        icon: FolderGit2,
        action: () => {
          router.push(`/projects/${p.slug}`);
          closePalette();
        },
      })),

      // External Links
      {
        id: "link-github",
        title: "Open GitHub Profile",
        subtitle: "github.com/shuvo-halder",
        category: "Links",
        icon: ExternalLink,
        action: () => {
          window.open("https://github.com/shuvo-halder", "_blank");
          closePalette();
        },
      },
      {
        id: "link-linkedin",
        title: "Open LinkedIn Profile",
        subtitle: "linkedin.com/in/shuvo-halder",
        category: "Links",
        icon: ExternalLink,
        action: () => {
          window.open("https://www.linkedin.com/in/shuvo-halder/", "_blank");
          closePalette();
        },
      },
      {
        id: "link-devto",
        title: "Open Dev.to Blog",
        subtitle: "dev.to/shuvo_h",
        category: "Links",
        icon: ExternalLink,
        action: () => {
          window.open("https://dev.to/shuvo_h", "_blank");
          closePalette();
        },
      },
    ];

    return list;
  }, [theme, copied, router, setTheme, closePalette, copyEmail]);

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-sm transition-all">
      <div
        className="w-full max-w-2xl rounded-xl border border-border bg-surface shadow-2xl overflow-hidden font-mono text-left animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-border bg-surface-hover/50">
          <Search className="w-4 h-4 text-accent-cyan mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, section, or project..."
            className="w-full bg-transparent border-none outline-none text-foreground font-mono text-sm placeholder:text-muted"
          />
          <button
            type="button"
            onClick={closePalette}
            aria-label="Close command palette"
            className="p-1 rounded text-muted hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              No matching commands or routes found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? "bg-accent-emerald/15 text-foreground border border-accent-emerald/40"
                      : "text-muted hover:bg-surface-elevated hover:text-foreground border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-accent-emerald" : "text-muted"}`} />
                    <div className="truncate text-left">
                      <div className="font-semibold text-foreground truncate">{item.title}</div>
                      {item.subtitle && <div className="text-[11px] text-muted truncate">{item.subtitle}</div>}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted shrink-0 uppercase tracking-wider ml-2">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-surface-hover border-t border-border flex items-center justify-between text-[11px] text-muted">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">↵</kbd> select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">esc</kbd> close
            </span>
          </div>
          <span className="text-accent-cyan font-semibold">INFRA-PALETTE v1.0</span>
        </div>
      </div>
    </div>
  );
}
