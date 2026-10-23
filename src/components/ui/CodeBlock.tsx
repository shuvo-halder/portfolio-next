"use client";

import * as React from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "bash",
  title,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="w-full rounded-lg border border-border bg-color-terminal-bg overflow-hidden font-mono text-xs shadow-lg">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-color-terminal-bar border-b border-border/80 text-muted">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-accent-emerald" />
          <span className="font-semibold text-foreground text-[11px]">
            {title || `${language.toUpperCase()} SNIPPET`}
          </span>
        </div>
        <button
          type="button"
          onClick={copyCode}
          aria-label="Copy code snippet"
          className="flex items-center space-x-1.5 px-2 py-1 rounded bg-surface hover:bg-surface-elevated text-muted hover:text-foreground border border-border/60 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-accent-emerald" />
              <span className="text-[10px] text-accent-emerald font-bold">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px]">COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents */}
      <div className="p-4 overflow-x-auto leading-relaxed text-foreground bg-color-terminal-bg/80">
        <pre className="flex">
          {showLineNumbers && (
            <div className="select-none text-muted pr-4 text-right border-r border-border/40 mr-4 opacity-50">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <code className="flex-1 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}
