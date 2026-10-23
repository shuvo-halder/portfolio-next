import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "C:/Users/ome/.gemini/antigravity/brain/949713f4-2fd0-49af-b296-7d6c077c8f4c";

async function run() {
  console.log("Launching Chromium browser (msedge channel)...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  // 1. Desktop Context (1440 x 900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopContext.newPage();

  console.log("Navigating to http://localhost:3000 (Desktop)...");
  await desktopPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(1500);

  // Desktop Hero screenshot
  console.log("Capturing desktop-hero.png...");
  await desktopPage.screenshot({
    path: path.join(ARTIFACT_DIR, "desktop-hero.png"),
    clip: { x: 0, y: 0, width: 1440, height: 860 },
  });

  // Desktop Pipeline
  console.log("Capturing desktop-pipeline.png...");
  const pipelineEl = await desktopPage.locator("#pipeline");
  if (await pipelineEl.count() > 0) {
    await pipelineEl.screenshot({
      path: path.join(ARTIFACT_DIR, "desktop-pipeline.png"),
    });
  }

  // Desktop Projects
  console.log("Capturing desktop-projects.png...");
  const projectsEl = await desktopPage.locator("#projects");
  if (await projectsEl.count() > 0) {
    await projectsEl.screenshot({
      path: path.join(ARTIFACT_DIR, "desktop-projects.png"),
    });
  }

  // Desktop GitHub Activity
  console.log("Capturing desktop-activity.png...");
  const activityEl = await desktopPage.locator("#activity");
  if (await activityEl.count() > 0) {
    await activityEl.screenshot({
      path: path.join(ARTIFACT_DIR, "desktop-activity.png"),
    });
  }

  // Trigger Command Palette with Ctrl+K
  console.log("Opening Command Palette with Control+k...");
  await desktopPage.keyboard.press("Control+k");
  await desktopPage.waitForTimeout(600);
  console.log("Capturing desktop-command-palette.png...");
  await desktopPage.screenshot({
    path: path.join(ARTIFACT_DIR, "desktop-command-palette.png"),
    clip: { x: 0, y: 0, width: 1440, height: 750 },
  });
  await desktopPage.keyboard.press("Escape");
  await desktopPage.waitForTimeout(300);

  // Navigate to Project Detail route
  console.log("Navigating to /projects/virtualhost-automation...");
  await desktopPage.goto("http://localhost:3000/projects/virtualhost-automation", { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(1000);
  console.log("Capturing desktop-project-detail.png...");
  await desktopPage.screenshot({
    path: path.join(ARTIFACT_DIR, "desktop-project-detail.png"),
    clip: { x: 0, y: 0, width: 1440, height: 950 },
  });

  await desktopContext.close();

  // 2. Mobile Context (390 x 844 - iPhone 14/15)
  console.log("Opening Mobile Context (390 x 844)...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();

  console.log("Navigating to http://localhost:3000 (Mobile)...");
  await mobilePage.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1500);

  console.log("Capturing mobile-hero.png...");
  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, "mobile-hero.png"),
    clip: { x: 0, y: 0, width: 390, height: 844 },
  });

  const mobileProjects = await mobilePage.locator("#projects");
  if (await mobileProjects.count() > 0) {
    console.log("Capturing mobile-projects.png...");
    await mobileProjects.screenshot({
      path: path.join(ARTIFACT_DIR, "mobile-projects.png"),
    });
  }

  await mobileContext.close();
  await browser.close();
  console.log("All screenshots updated successfully!");
}

run().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
