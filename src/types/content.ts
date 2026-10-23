export type ProficiencyLevel = "production" | "advanced" | "intermediate" | "planned";

export interface Skill {
  name: string;
  level: ProficiencyLevel;
  icon?: string;
  description?: string;
  featured?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
}

export interface ProjectArchitecture {
  summary: string;
  components: {
    name: string;
    description: string;
    tech: string;
  }[];
  diagramSvg?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: "automation" | "security" | "systems" | "networking" | "monitoring";
  stars?: number;
  forks?: number;
  featured: boolean;
  language: string;
  techTags: string[];
  problem: string;
  solution: string;
  impact: string;
  githubUrl: string;
  demoUrl?: string;
  installSnippet: string;
  features: string[];
  securityHighlights: string[];
  architecture: ProjectArchitecture;
}

export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location?: string;
  description: string[];
  skills: string[];
  type: "work" | "education" | "open-source" | "organization";
  isPlaceholder?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  badgeUrl: string;
  tier?: string;
  description: string;
  source: "github" | "hackerrank" | "huggingface" | "certification";
  link: string;
  isPlaceholder?: boolean;
}

export interface Profile {
  name: string;
  handle: string;
  title: string;
  tagline: string;
  persona: string;
  email: string;
  location: string;
  education: {
    degree: string;
    field: string;
    status: string;
    institution: string; // TODO: fill in specific institution name
  };
  organization: {
    name: string;
    handle: string;
    url: string;
    role: string;
  };
  summary: string[];
  philosophy: {
    title: string;
    description: string;
  }[];
  socials: {
    github: string;
    linkedin: string;
    devto: string;
    hackerrank: string;
    huggingface: string;
    email: string;
    website: string;
  };
}
