import { test, expect } from "@playwright/test";

test.skip("Product page Add to basket", async ({ page }) => {
    await page.goto("/");

    const q = page.locator('[data-qa="product-button"]').first();
    await q.waitFor();
    const BasketCounter = page.locator('[data-qa="header-basket-count"]');

    await expect(BasketCounter).toHaveText("0");

    await expect(q).toHaveText("Add to Basket");
    await q.click();

    await expect(BasketCounter).toHaveText("1");

    await expect(q).toHaveText("Remove from Basket");

    const checkoutLink = page.getByRole("link", { name: "Checkout" });
    await checkoutLink.waitFor();
    await checkoutLink.click();
    await page.waitForURL("/basket");
});
