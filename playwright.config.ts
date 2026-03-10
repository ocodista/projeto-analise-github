import { defineConfig, devices } from "@playwright/test";

export const config = defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "https://ocodista.github.io/projeto-analise-github/",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

export default config;
