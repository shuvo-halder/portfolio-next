export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  readable_publish_date: string;
  slug: string;
  path: string;
  url: string;
  comments_count: number;
  public_reactions_count: number;
  published_timestamp: string;
  cover_image: string | null;
  social_image: string;
  reading_time_minutes: number;
  tag_list: string[];
  tags: string;
}

export interface DevToFeed {
  articles: DevToArticle[];
  isFallback: boolean;
}
