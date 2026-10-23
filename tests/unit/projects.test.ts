import { describe, it, expect } from "vitest";
import { featuredProjects } from "@/data/projects";

describe("Featured Projects Data Integrity", () => {
  it("contains exactly the 6 required core systems tools", () => {
    expect(featuredProjects).toHaveLength(6);
  });

  it("each project has a unique slug and valid fields", () => {
    const slugs = new Set<string>();
    featuredProjects.forEach((p) => {
      expect(p.slug).toBeTruthy();
      expect(slugs.has(p.slug)).toBe(false);
      slugs.add(p.slug);

      expect(p.title).toBeTruthy();
      expect(p.tagline).toBeTruthy();
      expect(p.problem).toBeTruthy();
      expect(p.solution).toBeTruthy();
      expect(p.impact).toBeTruthy();
      expect(p.installSnippet).toBeTruthy();
      expect(p.githubUrl).toMatch(/^https:\/\/github\.com\/shuvo-halder\//);
      expect(p.architecture.components.length).toBeGreaterThan(0);
      expect(p.features.length).toBeGreaterThan(0);
      expect(p.securityHighlights.length).toBeGreaterThan(0);
    });
  });
});
