import { expect } from "@playwright/test";
import { Navigation } from "./navigation.js";

export class Checkout {
    constructor(page) {
        this.page = page;
        this.basketCards = page.locator('[data-qa="basket-card"]');
        this.basketItem = page.locator('[data-qa="basket-item-price"]');
        this.removeItemButton = page.locator(
            '[data-qa="basket-card-remove-item"]'
        );
        this.continueToCheckoutButton = page.locator(
            '[data-qa="continue-to-checkout"]'
        );
    }
    removeCheapestProduct = async () => {
        await this.basketCards.first().waitFor();
        const itemsBeforeRemoval = await this.basketCards.count();

        await this.basketItem.first().waitFor();
        const allPriceText = await this.basketItem.allInnerTexts();

        const justNumbers = allPriceText.map((a) => a.replace("$", ""));

        const smallest = Math.min(...justNumbers);

        const smallestPriceBasket = await this.basketCards
            .filter({
                hasText: smallest + "$",
            })
            .first();

        const removeButton = smallestPriceBasket.locator(
            '[data-qa="basket-card-remove-item"]'
        );

        await removeButton.waitFor({ state: "visible" });
        await removeButton.click();
        await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1);
    };
    continueToCheckout = async () => {
        await this.continueToCheckoutButton.waitFor();
        await this.continueToCheckoutButton.click();
        await this.page.waitForURL(/\/login/gm);
    };
}
