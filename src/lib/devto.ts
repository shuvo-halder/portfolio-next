import { DevToFeed, DevToArticle } from "@/types/devto";

const DEVTO_USERNAME = "shuvo_h";

const fallbackArticles: DevToArticle[] = [
  {
    id: 3614170,
    title: "Automate Apache/Nginx Virtual Server host in Seconds.",
    description: "🚀 Automate Apache/Nginx Virtual Hosts in Seconds (No More Manual Setup!) If you're a System Administrator or DevOps engineer managing multiple Linux servers...",
    readable_publish_date: "May 5",
    slug: "automate-apachenginx-virtual-server-host-in-seconds-1iak",
    path: "/shuvo_h/automate-apachenginx-virtual-server-host-in-seconds-1iak",
    url: "https://dev.to/shuvo_h/automate-apachenginx-virtual-server-host-in-seconds-1iak",
    comments_count: 0,
    public_reactions_count: 5,
    published_timestamp: "2026-05-05T09:56:12Z",
    cover_image: null,
    social_image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F4c4bibr82wxjwr0asw67.png",
    reading_time_minutes: 2,
    tag_list: ["opensource", "automation", "linux"],
    tags: "opensource, automation, linux",
  },
];

export async function fetchDevToArticles(): Promise<DevToFeed> {
  try {
    const res = await fetch(`https://dev.to/api/articles?username=${DEVTO_USERNAME}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Shuvo-DevOps-Portfolio",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return {
        articles: fallbackArticles,
        isFallback: true,
      };
    }

    const data: DevToArticle[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return {
        articles: fallbackArticles,
        isFallback: true,
      };
    }

    return {
      articles: data,
      isFallback: false,
    };
  } catch {
    return {
      articles: fallbackArticles,
      isFallback: true,
    };
  }
}
