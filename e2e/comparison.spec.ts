import { test, expect } from "@playwright/test";

test.describe("repository comparison flow", () => {
  test("compares two repositories and displays charts", async ({ page }) => {
    await page.goto("./");

    await page.getByRole("button", { name: "facebook/react" }).click();
    await page.getByRole("button", { name: "vuejs/vue" }).click();

    await expect(
      page.getByRole("link", { name: "facebook/react" })
    ).toBeVisible({ timeout: 20_000 });

    await expect(
      page.getByRole("link", { name: "vuejs/vue" })
    ).toBeVisible({ timeout: 20_000 });

    await expect(page.getByText("Stars").first()).toBeVisible();
    await expect(page.getByText("Forks").first()).toBeVisible();
    await expect(page.getByText("Contributors").first()).toBeVisible();

    const charts = page.locator("canvas, [data-zr-dom-id]");
    await expect(charts.first()).toBeVisible({ timeout: 20_000 });
  });
});
