import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PipelineDiagram } from "@/components/visualization/PipelineDiagram";
import { GithubSection } from "@/components/sections/GithubSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GithubSectionSkeleton, BlogSectionSkeleton } from "@/components/sections/Skeletons";

export default function Home() {
  return (
    <div className="space-y-12 pb-20">
      <HeroSection />

      <AboutSection />

      <SkillsSection />

      <ProjectsSection />

      <section id="pipeline" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PipelineDiagram />
      </section>

      <Suspense fallback={<GithubSectionSkeleton />}>
        <GithubSection />
      </Suspense>

      <ExperienceSection />

      <CertificationsSection />

      <Suspense fallback={<BlogSectionSkeleton />}>
        <BlogSection />
      </Suspense>

      <ContactSection />
    </div>
  );
}
