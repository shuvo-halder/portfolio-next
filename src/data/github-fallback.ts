export interface GitHubStatsFallback {
  user: {
    login: string;
    name: string;
    company: string;
    blog: string;
    location: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    avatar_url: string;
  };
  metrics: {
    totalStars: number;
    totalForks: number;
    totalRepos: number;
  };
  languages: { name: string; count: number; percentage: number }[];
  pinnedRepos: {
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
  }[];
}

export const githubFallbackData: GitHubStatsFallback = {
  user: {
    login: "shuvo-halder",
    name: "Shuvo Halder",
    company: "@BinRecon-Corp",
    blog: "https://binrecon.io",
    location: "/dev/null",
    bio: "Tech Enthusiast. \n\n~ MR. ROBOT",
    public_repos: 88,
    followers: 67,
    following: 19,
    avatar_url: "https://avatars.githubusercontent.com/u/42088593?v=4",
  },
  metrics: {
    totalStars: 134,
    totalForks: 153,
    totalRepos: 88,
  },
  languages: [
    { name: "Python", count: 21, percentage: 31.8 },
    { name: "HTML", count: 13, percentage: 19.7 },
    { name: "PHP", count: 12, percentage: 18.2 },
    { name: "JavaScript", count: 6, percentage: 9.1 },
    { name: "Shell", count: 5, percentage: 7.6 },
    { name: "Go", count: 4, percentage: 6.1 },
    { name: "TypeScript", count: 3, percentage: 4.5 },
    { name: "HCL / Others", count: 2, percentage: 3.0 },
  ],
  pinnedRepos: [
    {
      name: "virtualhost-automation",
      description: "Production-grade virtual host manager for Apache & Nginx on Ubuntu/Debian.",
      stars: 12,
      forks: 8,
      language: "Shell",
      url: "https://github.com/shuvo-halder/virtualhost-automation",
    },
    {
      name: "certbot-smart-manager",
      description: "Production-grade SSL certificate lifecycle management for Let's Encrypt / Certbot.",
      stars: 15,
      forks: 6,
      language: "Shell",
      url: "https://github.com/shuvo-halder/certbot-smart-manager",
    },
    {
      name: "log-archive-tool",
      description: "Bash log archiver with compression, integrity checks, structured logging, automated cleanup.",
      stars: 9,
      forks: 4,
      language: "Shell",
      url: "https://github.com/shuvo-halder/log-archive-tool",
    },
    {
      name: "nginx-inspector",
      description: "Advanced Nginx log analyzer with web dashboard & REST API.",
      stars: 18,
      forks: 7,
      language: "Python",
      url: "https://github.com/shuvo-halder/nginx-inspector",
    },
    {
      name: "core-panel",
      description: "Self-hosted VPS management platform, a modern lightweight alternative to cPanel.",
      stars: 14,
      forks: 5,
      language: "Python",
      url: "https://github.com/shuvo-halder/core-panel",
    },
    {
      name: "drmcs-mesh-communication",
      description: "Decentralized P2P mesh communication for disaster scenarios.",
      stars: 11,
      forks: 3,
      language: "Go",
      url: "https://github.com/shuvo-halder/drmcs-mesh-communication",
    },
  ],
};
