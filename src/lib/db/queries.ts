import { prisma } from './client';
import { profileData } from '@/data/content';
import { skillCategories as fallbackSkillCategories } from '@/data/skills';
import { featuredProjects as fallbackProjects } from '@/data/projects';
import { timelineItems as fallbackTimeline, achievementsData as fallbackAchievements } from '@/data/timeline';

/**
 * Data Access Layer with graceful fallbacks.
 * Ensures the public site can render statically even if DB is spinning up.
 */

export async function getProfile() {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: 'singleton' },
    });
    if (profile) return profile;
  } catch (err) {
    console.warn('DB getProfile fallback:', err);
  }

  return {
    id: 'singleton',
    name: profileData.name,
    headline: profileData.title,
    bio: profileData.summary.join('\n\n'),
    avatarUrl: '/avatar.png',
    resumeUrl: '/resume.pdf',
    location: profileData.location,
    email: profileData.email,
    availabilityStatus: 'available',
    availabilityMessage: 'Available for DevOps contracts, SRE consulting & infrastructure automation',
    socialLinks: profileData.socials,
    seoTitle: `${profileData.name} | DevOps Engineer`,
    seoDescription: profileData.tagline,
    ogImageUrl: null,
    updatedAt: new Date(),
  };
}

export async function getSkillCategories() {
  try {
    const categories = await prisma.skillCategory.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
      include: {
        skills: {
          where: { visible: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (categories.length > 0) return categories;
  } catch (err) {
    console.warn('DB getSkillCategories fallback:', err);
  }

  // Fallback to static seed data
  return fallbackSkillCategories.map((c, i) => ({
    id: c.id,
    name: c.name,
    slug: c.id,
    order: i,
    visible: true,
    skills: c.skills.map((s, j) => ({
      id: `${c.id}-${j}`,
      name: s.name,
      categoryId: c.id,
      iconKey: null,
      level: s.level.toUpperCase() as 'EXPERT' | 'ADVANCED' | 'PROFICIENT' | 'INTERMEDIATE' | 'BEGINNER',
      yearsExp: null,
      order: j,
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  }));
}

export async function getFeaturedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
    if (projects.length > 0) return projects;
  } catch (err) {
    console.warn('DB getFeaturedProjects fallback:', err);
  }

  // Fallback to static seed data
  return fallbackProjects.map((p, i) => ({
    id: `fb-${p.slug}`,
    title: p.title,
    slug: p.slug,
    summary: p.tagline,
    description: `### Overview\n${p.solution}\n\n### Problem\n${p.problem}\n\n### Impact\n${p.impact}`,
    repoUrl: p.githubUrl,
    liveUrl: p.demoUrl || null,
    coverImage: null,
    gallery: [],
    featured: p.featured,
    order: i,
    status: 'PUBLISHED' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: p.techTags.map((name) => ({
      projectId: `fb-${p.slug}`,
      tagId: name,
      tag: { id: name, name, slug: name.toLowerCase(), createdAt: new Date() },
    })),
  }));
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
    if (project) return project;
  } catch (err) {
    console.warn('DB getProjectBySlug fallback:', err);
  }

  const fallback = fallbackProjects.find((p) => p.slug === slug);
  if (!fallback) return null;

  return {
    id: `fb-${fallback.slug}`,
    title: fallback.title,
    slug: fallback.slug,
    summary: fallback.tagline,
    description: `### Overview\n${fallback.solution}\n\n### Problem\n${fallback.problem}\n\n### Impact\n${fallback.impact}\n\n${
      fallback.features ? `### Key Capabilities\n${fallback.features.map((f: string) => `- ${f}`).join('\n')}\n\n` : ''
    }${fallback.installSnippet ? `### Installation\n\`\`\`bash\n${fallback.installSnippet}\n\`\`\`` : ''}`,
    repoUrl: fallback.githubUrl,
    liveUrl: fallback.demoUrl || null,
    coverImage: null,
    gallery: [],
    featured: fallback.featured,
    order: 0,
    status: 'PUBLISHED' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: fallback.techTags.map((name) => ({
      projectId: `fb-${fallback.slug}`,
      tagId: name,
      tag: { id: name, name, slug: name.toLowerCase(), createdAt: new Date() },
    })),
  };
}

export async function getTimelineData() {
  try {
    const [experiences, educations] = await Promise.all([
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.education.findMany({ orderBy: { order: 'asc' } }),
    ]);

    if (experiences.length > 0 || educations.length > 0) {
      return { experiences, educations };
    }
  } catch (err) {
    console.warn('DB getTimelineData fallback:', err);
  }

  return {
    experiences: fallbackTimeline
      .filter((t) => t.type !== 'education')
      .map((e, i) => ({
        id: e.id,
        company: e.organization,
        role: e.role,
        location: e.location || 'Remote',
        startDate: new Date('2023-01-01'),
        endDate: null,
        current: true,
        description: e.description.join(' '),
        tech: e.skills,
        order: i,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    educations: fallbackTimeline
      .filter((t) => t.type === 'education')
      .map((edu, i) => ({
        id: edu.id,
        institution: edu.organization,
        degree: 'B.Tech',
        field: 'Computer Science',
        startDate: new Date('2022-09-01'),
        endDate: null,
        current: true,
        description: edu.description.join(' '),
        order: i,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
  };
}

export async function getAchievementsData() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { order: 'asc' },
    });
    if (achievements.length > 0) return achievements;
  } catch (err) {
    console.warn('DB getAchievementsData fallback:', err);
  }

  return fallbackAchievements.map((a, i) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    link: a.link || null,
    icon: null,
    order: i,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

const fallbackPost = {
  id: 'devto-vhost-automation',
  title: 'Automate Apache/Nginx Virtual Server host in Seconds',
  slug: 'automate-apache-nginx-virtual-hosts',
  excerpt: 'A comprehensive guide to automating virtual host provisioning on Ubuntu and Debian servers using strict Bash.',
  content: `## Automating Apache & Nginx Virtual Hosts

Manual virtual host configuration in production Linux environments introduces configuration drift, syntax errors, and inconsistent permissions.

### Core Automation Principles
- **Idempotency**: Rerunning the script with the same arguments results in the same deterministic system state.
- **Strict Error Handling**: Executing with \`set -Eeuo pipefail\` to prevent silent failures.
- **Permission Enforcement**: Standardizing document root ownership to \`www-data:www-data\` and permissions to \`755/644\`.

\`\`\`bash
# Create virtual host with dry-run verification
sudo virtualhost -d create api.internal.dev /var/www/api
\`\`\`
`,
  coverImage: null,
  readingTime: 4,
  status: 'PUBLISHED' as const,
  publishedAt: new Date('2024-03-15'),
  createdAt: new Date('2024-03-15'),
  updatedAt: new Date('2024-03-15'),
  tags: [
    { postId: 'devto-vhost-automation', tagId: 'linux', tag: { id: 'linux', name: 'Linux', slug: 'linux', createdAt: new Date() } },
    { postId: 'devto-vhost-automation', tagId: 'automation', tag: { id: 'automation', name: 'Automation', slug: 'automation', createdAt: new Date() } },
  ],
};

export async function getPublishedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
    if (posts.length > 0) return posts;
  } catch (err) {
    console.warn('DB getPublishedPosts fallback:', err);
  }
  return [fallbackPost];
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
    if (post && post.status === 'PUBLISHED') return post;
  } catch (err) {
    console.warn('DB getPostBySlug fallback:', err);
  }

  if (slug === fallbackPost.slug) return fallbackPost;
  return null;
}
