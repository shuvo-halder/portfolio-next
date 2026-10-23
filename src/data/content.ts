import { Profile } from "@/types/content";

/**
 * ============================================================================
 * SHUVO HALDER - PROFILE & CONTENT ARCHITECTURE
 * Note: Authentic data extracted from public GitHub, Dev.to, and BinRecon-Corp.
 * All missing or pending items are marked with // TODO: fill in
 * ============================================================================
 */

export const profileData: Profile = {
  name: "Shuvo Halder",
  handle: "shuvo-halder",
  title: "DevOps Engineer & System Administrator",
  tagline: "Engineering deterministic infrastructure, resilient automation pipelines, and hardened Linux environments.",
  persona: "Tech Enthusiast ~ MR. ROBOT",
  email: "shuvo-halder@outlook.com",
  location: "/dev/null",
  education: {
    degree: "B.Tech",
    field: "Computer Science",
    status: "Undergraduate",
    institution: "Computer Science Undergraduate", // TODO: fill in institution name if desired
  },
  organization: {
    name: "BinRecon Corp.",
    handle: "BinRecon-Corp",
    url: "https://binrecon.io",
    role: "Core Contributor & Systems Engineer",
  },
  summary: [
    "Specialized in automated Linux server management, production web servers (Nginx/Apache), SSL/TLS certificate lifecycle governance, and security-first bash orchestration.",
    "Author of production-grade sysadmin utilities including Virtualhost Automation, Certbot Smart Manager, and Log Archive Tool, with emphasis on idempotent execution, non-root isolation, and zero silent failures.",
    "Driven by the UNIX philosophy: small, composable, fault-tolerant tools operating with strict validation, lockfile concurrency safety, and structured logging.",
  ],
  philosophy: [
    {
      title: "Automation Over Repetition",
      description: "Any administrative task performed more than once must be codified into an idempotent, self-documenting, and auditable script.",
    },
    {
      title: "Defense in Depth",
      description: "Least privilege by default, strict umask policies, parameter allowlists, zero arbitrary shell execution, and hardened systemd unit sandboxing.",
    },
    {
      title: "Observability & Fault Tolerance",
      description: "If an operation fails, it must fail fast with structured JSON/system logs, clean trap handlers, and deterministic rollback mechanisms.",
    },
  ],
  socials: {
    github: "https://github.com/shuvo-halder",
    linkedin: "https://www.linkedin.com/in/shuvo-halder/",
    devto: "https://dev.to/shuvo_h",
    hackerrank: "https://www.hackerrank.com/profile/shuvohalder_1331",
    huggingface: "https://huggingface.co/shuvo-halder",
    email: "mailto:shuvo-halder@outlook.com",
    website: "https://binrecon.io",
  },
};

/**
 * ============================================================================
 * PLACEHOLDERS DIRECTORY FOR USER EDITING
 * Check these values to personalize your site with any additional details.
 * ============================================================================
 */
export const profilePlaceholders = {
  // TODO: fill in path to real PDF resume in public/ directory (e.g. "/resume.pdf")
  resumeUrl: "/resume.pdf",
  // TODO: fill in current employment or internship if applicable
  currentCompany: null,
  // TODO: fill in physical location if preferred over "/dev/null"
  publicLocation: "/dev/null",
};
