import { PrismaClient, SkillLevel, ProjectStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { profileData } from '../src/data/content';
import { skillCategories } from '../src/data/skills';
import { featuredProjects } from '../src/data/projects';
import { timelineItems, achievementsData } from '../src/data/timeline';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding portfolio database...');

  // 1. Seed Singleton Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'shuvo-halder@outlook.com';
  const rawAdminPassword = process.env.ADMIN_PASSWORD || 'admin_secure_devops_2026';
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(rawAdminPassword, salt);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: profileData.name,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      name: profileData.name,
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Admin user seeded: ${admin.email}`);

  // 2. Seed Singleton Profile
  const profile = await prisma.profile.upsert({
    where: { id: 'singleton' },
    update: {
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
      seoTitle: `${profileData.name} | DevOps Engineer & Systems Administrator`,
      seoDescription: profileData.tagline,
    },
    create: {
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
      seoTitle: `${profileData.name} | DevOps Engineer & Systems Administrator`,
      seoDescription: profileData.tagline,
    },
  });
  console.log(`Profile seeded for: ${profile.name}`);

  // 3. Seed Skill Categories and Skills
  let catOrder = 0;
  for (const cat of skillCategories) {
    const category = await prisma.skillCategory.upsert({
      where: { slug: cat.id },
      update: {
        name: cat.name,
        order: catOrder,
        visible: true,
      },
      create: {
        name: cat.name,
        slug: cat.id,
        order: catOrder,
        visible: true,
      },
    });

    let skillOrder = 0;
    for (const skill of cat.skills) {
      let level: SkillLevel = SkillLevel.PROFICIENT;
      if (skill.level === 'production') level = SkillLevel.EXPERT;
      else if (skill.level === 'advanced') level = SkillLevel.ADVANCED;
      else if (skill.level === 'planned') level = SkillLevel.BEGINNER;
      else level = SkillLevel.INTERMEDIATE;

      await prisma.skill.upsert({
        where: { id: `${category.id}-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` },
        update: {
          name: skill.name,
          categoryId: category.id,
          level,
          order: skillOrder,
          visible: true,
        },
        create: {
          id: `${category.id}-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: skill.name,
          categoryId: category.id,
          level,
          order: skillOrder,
          visible: true,
        },
      });
      skillOrder++;
    }
    catOrder++;
  }
  console.log(`Seeded ${skillCategories.length} skill categories and skills`);

  // 4. Seed Projects and Tags
  let projOrder = 0;
  for (const p of featuredProjects) {
    const descriptionContent = [
      `### Overview`,
      p.solution,
      `\n### Problem`,
      p.problem,
      `\n### Impact`,
      p.impact,
      p.features && p.features.length > 0 ? `\n### Key Features\n${p.features.map((f: string) => `- ${f}`).join('\n')}` : '',
      p.installSnippet ? `\n### Installation\n\`\`\`bash\n${p.installSnippet}\n\`\`\`` : '',
    ].filter(Boolean).join('\n\n');

    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        summary: p.tagline,
        description: descriptionContent,
        repoUrl: p.githubUrl,
        liveUrl: p.demoUrl || null,
        featured: p.featured,
        order: projOrder,
        status: ProjectStatus.PUBLISHED,
      },
      create: {
        title: p.title,
        slug: p.slug,
        summary: p.tagline,
        description: descriptionContent,
        repoUrl: p.githubUrl,
        liveUrl: p.demoUrl || null,
        featured: p.featured,
        order: projOrder,
        status: ProjectStatus.PUBLISHED,
      },
    });

    // Seed Tags
    for (const tagName of p.techTags) {
      const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: { name: tagName },
        create: { name: tagName, slug: tagSlug },
      });

      await prisma.projectTag.upsert({
        where: {
          projectId_tagId: {
            projectId: project.id,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          projectId: project.id,
          tagId: tag.id,
        },
      });
    }
    projOrder++;
  }
  console.log(`Seeded ${featuredProjects.length} featured projects`);

  // 5. Seed Timeline: Experience & Education
  let expOrder = 0;
  let eduOrder = 0;
  for (const item of timelineItems) {
    if (item.type === 'education') {
      await prisma.education.upsert({
        where: { id: item.id },
        update: {
          institution: item.organization,
          degree: 'B.Tech',
          field: 'Computer Science & Engineering',
          startDate: new Date('2022-09-01'),
          current: true,
          description: item.description.join(' '),
          order: eduOrder,
        },
        create: {
          id: item.id,
          institution: item.organization,
          degree: 'B.Tech',
          field: 'Computer Science & Engineering',
          startDate: new Date('2022-09-01'),
          current: true,
          description: item.description.join(' '),
          order: eduOrder,
        },
      });
      eduOrder++;
    } else {
      await prisma.experience.upsert({
        where: { id: item.id },
        update: {
          company: item.organization,
          role: item.role,
          location: item.location || 'Remote',
          startDate: new Date('2023-01-01'),
          current: item.period.includes('Present') || item.period.includes('Ongoing'),
          description: item.description.join(' '),
          tech: item.skills,
          order: expOrder,
        },
        create: {
          id: item.id,
          company: item.organization,
          role: item.role,
          location: item.location || 'Remote',
          startDate: new Date('2023-01-01'),
          current: item.period.includes('Present') || item.period.includes('Ongoing'),
          description: item.description.join(' '),
          tech: item.skills,
          order: expOrder,
        },
      });
      expOrder++;
    }
  }

  // 6. Seed Achievements
  let achOrder = 0;
  for (const ach of achievementsData) {
    await prisma.achievement.upsert({
      where: { id: `ach-${ach.id}` },
      update: {
        title: ach.title,
        description: ach.description,
        link: ach.link || null,
        order: achOrder,
      },
      create: {
        id: `ach-${ach.id}`,
        title: ach.title,
        description: ach.description,
        link: ach.link || null,
        order: achOrder,
      },
    });
    achOrder++;
  }

  // 7. Seed Default Settings
  const settings = [
    { key: 'site_title', value: `${profileData.name} | DevOps & Systems Engineer`, description: 'Public site meta title' },
    { key: 'seo_description', value: profileData.tagline, description: 'Public site meta description' },
    { key: 'enable_analytics', value: 'false', description: 'Enable Plausible or Umami analytics' },
    { key: 'contact_forward_email', value: profileData.email, description: 'Target inbox for contact form submissions' },
    { key: 'enable_blog', value: 'true', description: 'Enable blog routes on public site' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: { key: s.key, value: s.value, description: s.description },
    });
  }

  console.log('Database seeding successfully completed.');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
