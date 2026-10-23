import { SkillCategory } from "@/types/content";

export const skillCategories: SkillCategory[] = [
  {
    id: "linux-sysadmin",
    name: "Linux & Systems Administration",
    description: "Core operating system governance, process supervision, and kernel interfaces.",
    skills: [
      { name: "Ubuntu / Debian", level: "production", featured: true },
      { name: "Bash 4.0+ (set -Eeuo pipefail)", level: "production", featured: true },
      { name: "systemd (Services & Timers)", level: "production", featured: true },
      { name: "Networking (ss, ip, lsof, dig)", level: "production", featured: true },
      { name: "Firewall (UFW & firewalld)", level: "production", featured: true },
      { name: "Cron & Scheduled Jobs", level: "production" },
      { name: "Permissions, umask & PAM", level: "production" },
      { name: "Package Management (apt, dpkg)", level: "production" },
      { name: "Unix Domain Sockets (IPC)", level: "advanced" },
      { name: "/proc & /sys Telemetry", level: "advanced" },
    ],
  },
  {
    id: "webservers-proxy",
    name: "Web Servers & Reverse Proxy",
    description: "High-performance edge routing, SSL termination, and caching infrastructure.",
    skills: [
      { name: "Nginx (Reverse Proxy & Vhost)", level: "production", featured: true },
      { name: "Apache HTTP Server (mod_rewrite)", level: "production", featured: true },
      { name: "Let's Encrypt / Certbot Automation", level: "production", featured: true },
      { name: "SSL/TLS Hardening (A+ configs)", level: "production", featured: true },
      { name: "PHP-FPM (TCP & Unix Socket)", level: "production" },
      { name: "HTTP/2, Gzip & Brotli Caching", level: "production" },
      { name: "Rate Limiting & DDoS Buffers", level: "advanced" },
      { name: "Access & Error Log Aggregation", level: "production" },
    ],
  },
  {
    id: "containers",
    name: "Containers & Orchestration",
    description: "Deterministic packaging, isolated environments, and container runtime security.",
    skills: [
      { name: "Docker", level: "production", featured: true },
      { name: "Docker Compose (Multi-service)", level: "production", featured: true },
      { name: "Multi-stage Alpine Builds", level: "production", featured: true },
      { name: "Non-Root Container Hardening", level: "production", featured: true },
      { name: "Container Healthchecks", level: "production" },
      { name: "Bridge Networks & Port Mapping", level: "production" },
      // TODO: confirm Kubernetes proficiency before marking as production
      { name: "Kubernetes (K8s)", level: "planned", description: "In active evaluation / home-lab exploration" },
    ],
  },
  {
    id: "cicd-devops",
    name: "CI/CD & DevOps Automation",
    description: "Automated verification pipelines, artifact publishing, and release orchestration.",
    skills: [
      { name: "GitHub Actions", level: "production", featured: true },
      { name: "ShellCheck Static Analysis", level: "production", featured: true },
      { name: "GHCR Container Registry", level: "production" },
      { name: "Automated Testing Workflows", level: "production" },
      { name: "Idempotent Shell Installers", level: "production", featured: true },
      { name: "Automated Rollback Hooks", level: "production" },
    ],
  },
  {
    id: "programming-scripting",
    name: "Scripting & Systems Programming",
    description: "Languages used for CLI tooling, daemon development, and API backends.",
    skills: [
      { name: "Bash / POSIX Shell", level: "production", featured: true },
      { name: "Python (FastAPI, Flask)", level: "production", featured: true },
      { name: "Go (Daemons, P2P, CLI)", level: "advanced", featured: true },
      { name: "JavaScript / TypeScript", level: "advanced" },
      { name: "PHP", level: "production" },
      { name: "SQLite (WAL Mode & ACID)", level: "production" },
    ],
  },
  {
    id: "security-observability",
    name: "Security, Cryptography & Monitoring",
    description: "Threat detection, cryptographic authentication, and system monitoring.",
    skills: [
      { name: "OWASP Threat Detection (SQLi/XSS)", level: "production", featured: true },
      { name: "Nginx Log Pattern Analysis", level: "production", featured: true },
      { name: "Ed25519 & AES-256-GCM Crypto", level: "advanced" },
      { name: "Structured JSONL Audit Logging", level: "production" },
      { name: "SHA-256 File Integrity Checksums", level: "production" },
      { name: "SSH Key Authentication & Hardening", level: "production" },
    ],
  },
  {
    id: "cloud-iac-eval",
    name: "Cloud & Infrastructure as Code (Roadmap)",
    description: "Ecosystem tooling tracked for active evaluation and platform expansion.",
    skills: [
      // TODO: Confirm cloud providers when ready to mark as active
      { name: "AWS (EC2, S3, Route53)", level: "planned", description: "// TODO: confirm cloud profile" },
      { name: "Google Cloud Platform (GCP)", level: "planned", description: "// TODO: confirm cloud profile" },
      { name: "Terraform / OpenTofu", level: "planned", description: "// TODO: confirm IaC tooling" },
      { name: "Ansible Playbooks", level: "planned", description: "// TODO: confirm config management" },
      { name: "Prometheus & Grafana", level: "planned", description: "// TODO: confirm telemetry stack" },
    ],
  },
];
