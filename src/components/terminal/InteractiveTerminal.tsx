"use client";

import * as React from "react";
import { Terminal as TerminalIcon, Copy, Check, RotateCcw, CornerDownLeft } from "lucide-react";
import { profileData } from "@/data/content";

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

function getInitialLog(): CommandLog {
  return {
    id: "init-0",
    command: "whoami",
    timestamp: "10:00:00",
    output: (
      <div className="space-y-1 text-xs">
        <p className="text-accent-emerald font-semibold">
          {profileData.name} — {profileData.title}
        </p>
        <p className="text-muted leading-relaxed">
          Organization: {profileData.organization.name} ({profileData.organization.role})
        </p>
        <p className="text-muted leading-relaxed">
          Tagline: &quot;{profileData.persona}&quot; | Location: {profileData.location}
        </p>
        <p className="text-accent-cyan text-[11px] pt-1">
          Type <span className="text-foreground font-bold underline">help</span> to view available system commands.
        </p>
      </div>
    ),
  };
}

export function InteractiveTerminal() {
  const [input, setInput] = React.useState("");
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [copied, setCopied] = React.useState(false);
  const [logs, setLogs] = React.useState<CommandLog[]>([getInitialLog()]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const terminalEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll on new log entry
  React.useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    let outputNode: React.ReactNode = null;
    const lower = trimmed.toLowerCase();

    if (lower === "clear") {
      setLogs([]);
      setInput("");
      return;
    } else if (lower === "whoami") {
      outputNode = (
        <div className="space-y-1 text-xs">
          <p className="text-accent-emerald font-bold">{profileData.name}</p>
          <p className="text-muted">{profileData.title} @ {profileData.organization.name}</p>
          <p className="text-muted">Bio: {profileData.summary[0]}</p>
          <p className="text-accent-cyan text-[11px]">Identity verified · UID: 1001(shuvo) GID: 1001(sysadmin)</p>
        </div>
      );
    } else if (lower === "ls" || lower === "ls projects" || lower === "ls projects/" || lower === "dir") {
      outputNode = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-1">
          <div className="text-accent-emerald">drwxr-xr-x virtualhost-automation/ (Shell)</div>
          <div className="text-accent-emerald">drwxr-xr-x certbot-smart-manager/ (Shell)</div>
          <div className="text-accent-emerald">drwxr-xr-x log-archive-tool/ (Shell)</div>
          <div className="text-accent-cyan">drwxr-xr-x nginx-inspector/ (Python/JS)</div>
          <div className="text-accent-cyan">drwxr-xr-x core-panel/ (Python/React)</div>
          <div className="text-accent-amber">drwxr-xr-x drmcs-mesh/ (Go/P2P)</div>
        </div>
      );
    } else if (lower === "cat skills.txt" || lower === "skills") {
      outputNode = (
        <div className="space-y-1 text-xs text-muted">
          <p className="text-accent-emerald font-semibold">[LINUX & SYSADMIN]</p>
          <p>Ubuntu, Debian, systemd timers, Bash (set -Eeuo pipefail), cron, umask, UFW</p>
          <p className="text-accent-cyan font-semibold pt-1">[SERVERS & PROXY]</p>
          <p>Nginx reverse proxy, Apache 2.4, Let&apos;s Encrypt / Certbot, SSL A+ hardening, PHP-FPM</p>
          <p className="text-accent-amber font-semibold pt-1">[CONTAINERS & DEVOPS]</p>
          <p>Docker, Docker Compose, Multi-stage Alpine builds, GitHub Actions CI/CD</p>
        </div>
      );
    } else if (lower === "uptime") {
      outputNode = (
        <p className="text-xs text-accent-emerald">
          up 14h 22m, 1 user, load average: 0.04, 0.02, 0.00 (Status: ALL_SYSTEMS_NOMINAL)
        </p>
      );
    } else if (lower === "status" || lower === "systemctl status") {
      outputNode = (
        <div className="space-y-1 text-xs font-mono">
          <p className="text-accent-emerald">● nginx.service - Active (running) since boot [Port 80/443]</p>
          <p className="text-accent-emerald">● certbot-smart.timer - Active (waiting) next run 03:00 UTC</p>
          <p className="text-accent-emerald">● docker.service - Active (running) 6 containers online</p>
          <p className="text-accent-cyan">● portfolio-next.service - Active (healthy) 0 restarts</p>
        </div>
      );
    } else if (lower === "contact") {
      outputNode = (
        <div className="space-y-1 text-xs">
          <p className="text-foreground">Email: <a href="mailto:shuvo-halder@outlook.com" className="text-accent-emerald underline">shuvo-halder@outlook.com</a></p>
          <p className="text-foreground">LinkedIn: <a href="https://www.linkedin.com/in/shuvo-halder/" target="_blank" rel="noreferrer" className="text-accent-cyan underline">in/shuvo-halder</a></p>
          <p className="text-foreground">GitHub: <a href="https://github.com/shuvo-halder" target="_blank" rel="noreferrer" className="text-accent-amber underline">github.com/shuvo-halder</a></p>
        </div>
      );
    } else if (lower === "help") {
      outputNode = (
        <div className="space-y-1 text-xs text-muted">
          <p className="text-foreground font-semibold">Available Commands:</p>
          <p><span className="text-accent-emerald font-bold">whoami</span> - Display operator profile and system identity</p>
          <p><span className="text-accent-emerald font-bold">ls</span> - List featured engineering repositories</p>
          <p><span className="text-accent-emerald font-bold">cat skills.txt</span> - Display core infrastructure stack</p>
          <p><span className="text-accent-emerald font-bold">uptime</span> - Show host session runtime and telemetry</p>
          <p><span className="text-accent-emerald font-bold">status</span> - Inspect systemd service units status</p>
          <p><span className="text-accent-emerald font-bold">contact</span> - Display direct communication channels</p>
          <p><span className="text-accent-emerald font-bold">clear</span> - Clear terminal buffer</p>
        </div>
      );
    } else {
      outputNode = (
        <p className="text-xs text-accent-red">
          bash: command not found: {trimmed}. Type <span className="text-foreground font-bold underline">help</span> for a list of commands.
        </p>
      );
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        timestamp: timeStr,
        output: outputNode,
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
  };

  const copyTerminalContent = () => {
    const text = logs
      .map((l) => `shuvo@infra-control:~$ ${l.command}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTerminal = () => {
    setLogs([getInitialLog()]);
  };

  return (
    <div
      className="w-full rounded-xl border border-border bg-color-terminal-bg shadow-2xl overflow-hidden font-mono text-left transition-all"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Window Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-color-terminal-bar border-b border-border/80 select-none">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent-red opacity-80" />
          <div className="w-3 h-3 rounded-full bg-accent-amber opacity-80" />
          <div className="w-3 h-3 rounded-full bg-accent-emerald opacity-80" />
          <span className="text-xs text-muted ml-2 font-semibold tracking-wide">
            shuvo@infra-control:~ (bash)
          </span>
        </div>

        <div className="flex items-center space-x-2 text-muted">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              copyTerminalContent();
            }}
            aria-label="Copy terminal text"
            className="p-1 rounded hover:text-foreground hover:bg-surface-elevated transition-colors"
            title="Copy command history"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetTerminal();
            }}
            aria-label="Reset terminal"
            className="p-1 rounded hover:text-foreground hover:bg-surface-elevated transition-colors"
            title="Reset terminal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 sm:p-5 space-y-3 min-h-[300px] max-h-[420px] overflow-y-auto font-mono text-xs text-foreground">
        {logs.map((log) => (
          <div key={log.id} className="space-y-1.5">
            <div className="flex items-center space-x-2 text-muted">
              <span className="text-accent-emerald font-bold">shuvo@infra:~$</span>
              <span className="text-foreground">{log.command}</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{log.timestamp}</span>
            </div>
            <div className="pl-4 border-l border-border/40 py-0.5">{log.output}</div>
          </div>
        ))}

        {/* Active Command Prompt */}
        <div className="flex items-center space-x-2 pt-1">
          <span className="text-accent-emerald font-bold">shuvo@infra:~$</span>
          <div className="flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Interactive Terminal Input"
              autoComplete="off"
              spellCheck="false"
              className="w-full bg-transparent border-none outline-none text-foreground font-mono text-xs focus:ring-0 p-0"
              placeholder="type 'help', 'ls', 'uptime'..."
            />
          </div>
          <button
            type="button"
            onClick={() => executeCommand(input)}
            aria-label="Send command"
            className="text-muted hover:text-accent-emerald transition-colors p-1"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer Telemetry */}
      <div className="px-4 py-1.5 bg-color-terminal-bar/60 border-t border-border/40 flex items-center justify-between text-[11px] text-muted">
        <div className="flex items-center space-x-3">
          <span>PORT: 22(SSH)</span>
          <span>TTY: pts/0</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-1 text-accent-emerald">
          <TerminalIcon className="w-3 h-3" />
          <span>SHELL_ONLINE</span>
        </div>
      </div>
    </div>
  );
}
