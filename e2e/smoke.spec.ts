import { test, expect } from "@playwright/test";

test.describe("GitHub Repository Comparator", () => {
  test.describe("initial load", () => {
    test("displays the heading and search input", async ({ page }) => {
      await page.goto("./");

      await expect(
        page.getByRole("heading", { name: "Compare Repositories" })
      ).toBeVisible();

      await expect(
        page.getByPlaceholder("Search repositories")
      ).toBeVisible();
    });
  });

  test.describe("repository selection", () => {
    test("renders a repo card after clicking a suggested repo", async ({
      page,
    }) => {
      await page.goto("./");

      await page.getByRole("button", { name: "facebook/react" }).click();

      await expect(
        page.getByRole("link", { name: "facebook/react" })
      ).toBeVisible({ timeout: 15_000 });
    });
  });
});
