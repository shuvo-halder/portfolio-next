import { GitHubTelemetry, GitHubUser, GitHubRepo, GitHubLanguageStat } from "@/types/github";
import { githubFallbackData } from "@/data/github-fallback";

const GITHUB_USERNAME = "shuvo-halder";

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  HTML: "#e34c26",
  PHP: "#4F5D95",
  JavaScript: "#f1e05a",
  Shell: "#89e051",
  Go: "#00ADD8",
  TypeScript: "#3178c6",
  HCL: "#844FBA",
  CSS: "#563d7c",
};

export async function fetchGitHubTelemetry(): Promise<GitHubTelemetry> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Shuvo-DevOps-Portfolio",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return getFallbackTelemetry();
    }

    const user: GitHubUser = await userRes.json();
    const repos: GitHubRepo[] = await reposRes.json();

    if (!Array.isArray(repos)) {
      return getFallbackTelemetry();
    }

    // Compute metrics
    let totalStars = 0;
    let totalForks = 0;
    const languageCounts: Record<string, number> = {};

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const totalLangInstances = Object.values(languageCounts).reduce((a, b) => a + b, 0);
    const languages: GitHubLanguageStat[] = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalLangInstances > 0 ? Number(((count / totalLangInstances) * 100).toFixed(1)) : 0,
        color: LANGUAGE_COLORS[name] || "#94a3b8",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Top repos sorted by stars or recency
    const topRepos = repos
      .filter((r) => !r.name.includes(".github"))
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description || "Production systems automation repository.",
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language || "Code",
        url: r.html_url,
        updatedAt: r.updated_at,
      }));

    return {
      user: {
        login: user.login,
        name: user.name || "Shuvo Halder",
        company: user.company || "@BinRecon-Corp",
        blog: user.blog || "https://binrecon.io",
        location: user.location || "/dev/null",
        bio: user.bio || "Tech Enthusiast. ~ MR. ROBOT",
        public_repos: user.public_repos || repos.length,
        followers: user.followers || 67,
        following: user.following || 19,
        avatar_url: user.avatar_url || githubFallbackData.user.avatar_url,
      },
      stats: {
        totalRepos: user.public_repos || repos.length,
        totalStars: totalStars || githubFallbackData.metrics.totalStars,
        totalForks: totalForks || githubFallbackData.metrics.totalForks,
        followers: user.followers || 67,
      },
      languages: languages.length > 0 ? languages : githubFallbackData.languages,
      topRepos: topRepos.length > 0 ? topRepos : githubFallbackData.pinnedRepos.map((p) => ({ ...p, updatedAt: new Date().toISOString() })),
      isFallback: false,
    };
  } catch {
    return getFallbackTelemetry();
  }
}

function getFallbackTelemetry(): GitHubTelemetry {
  return {
    user: githubFallbackData.user,
    stats: {
      totalRepos: githubFallbackData.metrics.totalRepos,
      totalStars: githubFallbackData.metrics.totalStars,
      totalForks: githubFallbackData.metrics.totalForks,
      followers: githubFallbackData.user.followers,
    },
    languages: githubFallbackData.languages.map((l) => ({
      ...l,
      color: LANGUAGE_COLORS[l.name] || "#94a3b8",
    })),
    topRepos: githubFallbackData.pinnedRepos.map((r) => ({
      ...r,
      updatedAt: "2026-10-02T22:04:00Z",
    })),
    isFallback: true,
  };
}
