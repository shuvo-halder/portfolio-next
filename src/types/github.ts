export interface GitHubUser {
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
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  pushed_at: string;
}

export interface GitHubLanguageStat {
  name: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface GitHubTelemetry {
  user: GitHubUser;
  stats: {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    followers: number;
  };
  languages: GitHubLanguageStat[];
  topRepos: {
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
    updatedAt: string;
  }[];
  isFallback: boolean;
}
