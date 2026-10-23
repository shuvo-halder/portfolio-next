"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md border border-border bg-surface flex items-center justify-center opacity-60" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-border bg-surface text-foreground hover:bg-surface-hover hover:border-accent-emerald transition-colors focus:outline-none focus:ring-2 focus:ring-accent-emerald/40"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-accent-amber" />
      ) : (
        <Moon className="w-4 h-4 text-accent-cyan" />
      )}
    </button>
  );
}
