import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "hk8yzm",
  e2e: {
    baseUrl: "http://localhost:4173",
    specPattern: "**/*.cy.js",
    screenshotsFolder: "cypress/screenshots",
    screenshotOnRunFailure: true,
    videosFolder: "cypress/videos",
    video: true,
    trashAssetsBeforeRuns: true,
    experimentalRunAllSpecs: true,
  },
});
