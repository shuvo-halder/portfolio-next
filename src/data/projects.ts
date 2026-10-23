import { Project } from "@/types/content";

export const featuredProjects: Project[] = [
  {
    slug: "virtualhost-automation",
    title: "Virtualhost Automation",
    tagline: "Production-grade virtual host manager for Apache 2.4 & Nginx on Ubuntu/Debian",
    category: "automation",
    featured: true,
    language: "Shell",
    techTags: ["Bash 4.0+", "Apache 2.4", "Nginx", "PHP-FPM", "systemd", "Ubuntu/Debian"],
    problem:
      "Manual virtual host creation on production Linux servers is prone to configuration typos, broken permissions, missing DNS mapping in /etc/hosts, unversioned changes, and ungraceful web server reloads.",
    solution:
      "Built a modular, strict Bash automation suite (`virtualhost` & `virtualhost-nginx`) featuring automated document root provisioning, DNS resolution management, dry-run safety (`-d`), verbose debugging (`-v`), security hardening, and automatic state backups.",
    impact:
      "Reduces virtual host setup time from 15 minutes of manual editing to a single 2-second command, with 100% error-handling coverage, centralized logging in `/var/log/virtualhost/`, and automatic rollback on failure.",
    githubUrl: "https://github.com/shuvo-halder/virtualhost-automation",
    installSnippet: `# Download and install globally
cd /usr/local/bin
sudo wget https://raw.githubusercontent.com/shuvo-halder/virtualhost-automation/master/virtualhost.sh
sudo chmod +x virtualhost.sh && sudo ln -s virtualhost.sh virtualhost

# Create a virtual host with dry-run verification
sudo virtualhost -d create api.production.dev /var/www/api`,
    features: [
      "Automated web root directory creation with 755/644 permission enforcement",
      "Dynamic /etc/hosts local DNS mapping with automatic backup preservation",
      "Per-domain access and error log segregation",
      "Dry-run simulation mode (-d) to preview configuration diffs without touching the filesystem",
      "Support for both Apache (mod_rewrite, Gzip) and Nginx (Unix/TCP PHP-FPM sockets, static caching)",
      "Graceful reload hooks preventing production service interruption",
    ],
    securityHighlights: [
      "Strict input validation on domain arguments preventing command injection",
      "Denial of hidden files (.git, .env) in generated server blocks",
      "Non-root ownership assignment to prevent unauthorized privilege elevation",
    ],
    architecture: {
      summary:
        "The CLI interfaces directly with Apache2 / Nginx site directories (/etc/apache2/sites-available and /etc/nginx/sites-available) via parameterized templates, verifies syntax using apache2ctl/nginx -t, and manages system hosts atomically.",
      components: [
        {
          name: "virtualhost CLI",
          description: "Main entry point handling argument parsing, flags, and command routing",
          tech: "Bash 4.0+",
        },
        {
          name: "Configuration Generator",
          description: "Generates framework-ready virtual host templates with Gzip & PHP-FPM sockets",
          tech: "Nginx / Apache vhost syntax",
        },
        {
          name: "System Hook Manager",
          description: "Safely edits /etc/hosts with timestamped backups and executes systemctl reloads",
          tech: "systemd / sed / flock",
        },
      ],
    },
  },
  {
    slug: "certbot-smart-manager",
    title: "Certbot Smart Manager",
    tagline: "Enterprise SSL/TLS certificate lifecycle management for Let's Encrypt / Certbot",
    category: "security",
    featured: true,
    language: "Shell",
    techTags: ["Bash", "Certbot", "OpenSSL", "systemd timers", "UFW", "Telegram / Slack Webhooks"],
    problem:
      "Standard Let's Encrypt renewal via basic cron jobs frequently fails silently due to unexpected firewall rules, expired dependencies, or domain validation issues, resulting in catastrophic production certificate outages.",
    solution:
      "Architected a comprehensive SSL lifecycle daemon with twice-daily systemd timer execution, pre-flight firewall and web server detection, automatic `/etc/letsencrypt/` backups with 30-day retention, and multi-channel proactive alerting.",
    impact:
      "Over 2,500 lines of hardened Bash (`set -Eeuo pipefail`, `umask 027`, `flock`), 100% ShellCheck compliant across 8+ Linux distros (Ubuntu, Debian, RHEL, Rocky, AlmaLinux, Fedora).",
    githubUrl: "https://github.com/shuvo-halder/certbot-smart-manager",
    installSnippet: `# Clone and execute idempotent installer
git clone https://github.com/shuvo-halder/certbot-smart-manager.git
cd certbot-smart-manager
sudo ./install.sh

# Interactive CLI or automated dry-run check
sudo ssl-manager --check
sudo ssl-manager --dry-run`,
    features: [
      "Twice-daily systemd timer scheduling at 03:00 & 15:00 with randomized jitter delay",
      "Interactive 11-option ncurses-style terminal menu (`ssl-manager`) for manual maintenance",
      "Multi-channel notifications: SMTP Email, Telegram Bot API, Slack Incoming Webhooks, and console `wall`",
      "Automatic timestamped backups of `/etc/letsencrypt/` before any renewal action",
      "Self-contained rollback engine restoring full configuration on failure",
      "SELinux-aware permission handling and temporary firewall port 80/443 orchestration",
    ],
    securityHighlights: [
      "Fail-fast execution with set -Eeuo pipefail and trapped error handlers",
      "Strict umask 027 (files 640, directories 750) and root-only configuration (600)",
      "Zero arbitrary eval execution with flock concurrency locks",
    ],
    architecture: {
      summary:
        "Modular architecture split into utils, server detection, certificate operations, notification dispatchers, and backup managers, driven by systemd timers.",
      components: [
        {
          name: "certbot-smart.timer",
          description: "Systemd timer running checks twice daily with randomized delay",
          tech: "systemd",
        },
        {
          name: "ssl-manager Core",
          description: "Modular Bash engine handling certificate inspection, dry-runs, and renewal",
          tech: "Bash / Certbot / OpenSSL",
        },
        {
          name: "Notification Engine",
          description: "Dispatches alerts across Telegram, Slack, SMTP, and system wall",
          tech: "curl / REST APIs",
        },
        {
          name: "Backup & Rollback Vault",
          description: "Maintains rolling 30-day snapshots in /var/backups/certbot-smart-manager/",
          tech: "tar / sha256sum",
        },
      ],
    },
  },
  {
    slug: "log-archive-tool",
    title: "Log Archive Tool",
    tagline: "High-performance Bash log archiver with compression, SHA256 integrity, and remote sync",
    category: "systems",
    featured: true,
    language: "Shell",
    techTags: ["Bash 5.0+", "pigz", "gzip", "sha256sum", "Rsync", "OpenSSH", "cron"],
    problem:
      "Production Linux instances routinely exhaust disk space due to uncompressed application logs. Ad-hoc cleanup scripts lack checksum integrity verification, structured audit records, and reliable offsite replication.",
    solution:
      "Developed an enterprise-grade log archival script that automatically detects multi-core `pigz` for high-throughput compression, computes SHA256 integrity hashes, outputs structured JSONL logs, and syncs offsite via SCP/Rsync with exponential backoff retries.",
    impact:
      "Achieves 80-90% disk space reduction with verifiable data integrity, zero lost records during network blips, and machine-readable JSONL audit logs parseable by jq and ELK.",
    githubUrl: "https://github.com/shuvo-halder/log-archive-tool",
    installSnippet: `# Clone and configure
git clone https://github.com/shuvo-halder/log-archive-tool.git
cd log-archive-tool
chmod +x log-archive-enhanced.sh

# Run archive with verification and 30-day retention
./log-archive-enhanced.sh --log-dir /var/log --verify --retention 30`,
    features: [
      "Smart compression: auto-detects parallel gzip (pigz) or falls back to gzip",
      "Timestamped archive creation: logs_archive_YYYYMMDD_HHMMSS.tar.gz",
      "Cryptographic integrity verification via SHA256 checksum generation and validation",
      "Remote offsite replication over SSH using Rsync or SCP with exponential retry backoff",
      "Pre-flight SSH connectivity, remote directory check, and disk space validation",
      "Automated retention enforcement for both local and remote backup directories",
      "Structured JSONL log output for ingestion into monitoring and alerting pipelines",
    ],
    securityHighlights: [
      "Strict mode set -Eeuo pipefail preventing silent pipeline failure",
      "SSH private key permission enforcement (600) and connection timeouts",
      "Input directory path sanitization preventing path traversal exploits",
    ],
    architecture: {
      summary:
        "Pipeline-oriented execution: Pre-flight validation -> Multi-core compression -> SHA256 checksumming -> Local retention cleanup -> Remote SSH sync with retry loop -> JSONL telemetry emission.",
      components: [
        {
          name: "Compression Subsystem",
          description: "Parallel gzip compression via pigz with fallback to standard gzip",
          tech: "tar / pigz / gzip",
        },
        {
          name: "Integrity Engine",
          description: "Calculates and embeds SHA256 checksums alongside each archive",
          tech: "sha256sum",
        },
        {
          name: "Remote Sync Manager",
          description: "Handles authenticated Rsync/SCP transfer with exponential backoff (default: 3 retries)",
          tech: "OpenSSH / Rsync",
        },
      ],
    },
  },
  {
    slug: "nginx-inspector",
    title: "Nginx Inspector",
    tagline: "Advanced Nginx log analyzer with real-time threat detection, web dashboard & REST API",
    category: "monitoring",
    featured: true,
    language: "Python",
    techTags: ["Python 3.7+", "Flask", "JavaScript", "Chart.js", "Nginx", "REST API"],
    problem:
      "Web servers encounter relentless automated scanning, SQL injections, directory traversals, and brute-force probes that stay hidden within gigabytes of plain text access logs until severe security incidents occur.",
    solution:
      "Engineered a real-time log analysis platform combining a 12+ endpoint REST API with an interactive dark-themed telemetry dashboard. Features 20+ signature-based OWASP threat detection patterns and dynamic IP blocking hooks.",
    impact:
      "Parses multi-gigabyte log streams in real-time, providing immediate visual analytics on status codes (4xx/5xx spikes), bandwidth consumption, top user agents, and actively malicious IP addresses.",
    githubUrl: "https://github.com/shuvo-halder/nginx-inspector",
    installSnippet: `# Clone repository
git clone https://github.com/shuvo-halder/nginx-inspector.git
cd nginx-inspector

# Setup Python environment and run
pip install -r requirements.txt
python app.py
# Access dashboard at http://localhost:8765`,
    features: [
      "Real-time access log ingestion and continuous pattern matching",
      "Security threat detection: SQL Injection, XSS, Directory Traversal, Command Injection, and Nikto/SQLMap scanners",
      "Status code health distribution, 404 error tracing, and response time metrics",
      "Interactive Chart.js visualizations with auto-refresh every 30 seconds",
      "Comprehensive report generation in JSON, CSV, and formatted HTML",
      "Dynamic IP blocking integration via system firewall rules",
    ],
    securityHighlights: [
      "API key authentication on all monitoring endpoints",
      "Safe log file reading with read-only permissions (chmod 640)",
      "Strict parameter validation on log path arguments",
    ],
    architecture: {
      summary:
        "Python Flask server ingesting Nginx combined log format files, passing entries through a regex-based pattern matching pipeline, caching aggregations, and serving a lightweight responsive dashboard.",
      components: [
        {
          name: "Log Parser & Analyzer",
          description: "Regex extraction pipeline processing client IPs, request methods, URIs, and status codes",
          tech: "Python regex",
        },
        {
          name: "Threat Detection Engine",
          description: "Pattern library matching OWASP attack signatures and malicious security tools",
          tech: "Python heuristics",
        },
        {
          name: "REST API & Web UI",
          description: "Serves endpoints for automation and renders real-time Chart.js telemetry",
          tech: "Flask / Chart.js",
        },
      ],
    },
  },
  {
    slug: "core-panel",
    title: "CorePanel",
    tagline: "Lightweight, secure Linux VPS management control plane with privilege separation",
    category: "systems",
    featured: true,
    language: "Python",
    techTags: ["Python FastAPI", "React", "TypeScript", "Vite", "Tailwind CSS", "Unix Sockets", "SQLite WAL"],
    problem:
      "Legacy web hosting panels (cPanel, CyberPanel) are bloated, resource-heavy, and notoriously susceptible to remote privilege escalation vulnerabilities caused by executing arbitrary shell commands as root.",
    solution:
      "Designed a zero-trust architecture enforcing defense-in-depth: an unprivileged FastAPI control plane (`corepanel` user) communicating with a privileged `CoreAgent` daemon via a 0660 Unix domain socket with an allowlist-only registry (`shell=True` strictly forbidden).",
    impact:
      "Near-zero idle CPU/RAM overhead, completely immune to shell injection exploits, and reads real-time server telemetry directly from kernel interfaces (`/proc`, systemd).",
    githubUrl: "https://github.com/shuvo-halder/core-panel",
    installSnippet: `# Clone repository
git clone https://github.com/shuvo-halder/core-panel.git
cd core-panel

# Install and start backend
pip install -r backend/requirements.txt
pytest backend/tests`,
    features: [
      "Strict process privilege separation between web-facing API and privileged host agent",
      "Zero arbitrary shell execution: all commands parameterized with strict binary allowlisting",
      "Live kernel telemetry sourced directly from /proc and systemd rather than cached heuristics",
      "SQLite metadata database running in Write-Ahead Logging (WAL) mode for maximum concurrency",
      "Structured JSON logging with automatic credential and token redaction",
      "Modern React / TypeScript / Vite single page application with Tailwind CSS",
    ],
    securityHighlights: [
      "Unix Domain Socket communication restricted to 0660 permissions with group isolation",
      "Pydantic strict schema validation on all IPC frames and HTTP payloads",
      "NoNewPrivileges and systemd sandboxing applied to the control plane process",
    ],
    architecture: {
      summary:
        "Two-tier architecture: React Frontend -> FastAPI Control Plane (unprivileged) -> 0660 Unix Socket IPC -> Privileged CoreAgent Daemon (root, allowlisted operations only) -> Linux Kernel.",
      components: [
        {
          name: "Unprivileged Control Plane",
          description: "FastAPI server running as unprivileged user, validating HTTP requests and managing SQLite state",
          tech: "FastAPI / Pydantic / SQLite",
        },
        {
          name: "Unix Socket IPC",
          description: "Versioned bidirectional JSON IPC over /run/corepanel/agent.sock",
          tech: "Asyncio Unix Sockets",
        },
        {
          name: "CoreAgent Daemon",
          description: "Privileged agent executing allowlisted system operations with zero shell=True invocation",
          tech: "Python / systemd / /proc",
        },
      ],
    },
  },
  {
    slug: "drmcs-mesh-communication",
    title: "DRMCS Mesh Communication",
    tagline: "Decentralized peer-to-peer mesh communication system for off-grid crisis scenarios",
    category: "networking",
    featured: true,
    language: "Go",
    techTags: ["Go 1.21+", "Python FastAPI", "React", "Docker", "AES-256-GCM", "Ed25519", "AODV"],
    problem:
      "During natural disasters and infrastructure collapses, cellular towers and internet backbones fail completely, leaving emergency rescue teams and survivors without communication channels.",
    solution:
      "Created a zero-infrastructure decentralized mesh network in Go featuring automatic UDP broadcast peer discovery with Ed25519 signature authentication, AODV dynamic routing (RREQ/RREP), AES-256-GCM encrypted messaging, 256KB chunked file transfers, and a real-time topology dashboard.",
    impact:
      "Sub-3-second peer discovery, resilient multi-hop message forwarding without cellular/internet access, and validated across a multi-node Docker network emulation testbed.",
    githubUrl: "https://github.com/shuvo-halder/drmcs-mesh-communication",
    installSnippet: `# Clone and start first node
git clone https://github.com/shuvo-halder/drmcs-mesh-communication.git
cd drmcs/backend
go run ./cmd/drmcsd --port 8080 --name node1 --data ./data

# Start second node in another terminal (auto-discovers via UDP)
go run ./cmd/drmcsd --port 9080 --name node2 --data ./data2`,
    features: [
      "Automatic device discovery via UDP broadcast with Ed25519 signature verification",
      "Dynamic AODV multi-hop route discovery (RREQ/RREP) with sequence number collision avoidance",
      "Emergency broadcast alerts with priority levels (Normal, High, Critical)",
      "Chunked file sharing (256KB chunks) with SHA-256 integrity verification and auto-expiry",
      "End-to-end payload encryption using AES-256-GCM with deterministic shared keys",
      "Real-time network topology graphing using Python NetworkX and React SSE/WebSocket streams",
    ],
    securityHighlights: [
      "Ed25519 cryptographic key pairs generated per node at startup",
      "Replay attack mitigation using strict timestamp validation on all broadcast frames",
      "AES-256-GCM authenticated encryption for all point-to-point payloads",
    ],
    architecture: {
      summary:
        "7-layer architecture: User Device Layer -> Discovery Layer (UDP + Ed25519) -> Routing Layer (AODV) -> Communication Layer (REST/SSE) -> Analytics Layer (FastAPI/NetworkX) -> Storage (Local SQLite).",
      components: [
        {
          name: "Go Mesh Core (drmcsd)",
          description: "Main daemon managing discovery, AODV routing, cryptographic channels, and message queues",
          tech: "Go 1.21+ / UDP / SQLite",
        },
        {
          name: "Analytics Engine",
          description: "Python FastAPI service compiling topology matrices and calculating delivery latencies",
          tech: "FastAPI / NetworkX / Pandas",
        },
        {
          name: "Emergency Control UI",
          description: "Dark-themed dashboard for real-time peer topology, emergency dispatch, and file transfers",
          tech: "React / SSE / WebSockets",
        },
      ],
    },
  },
];
