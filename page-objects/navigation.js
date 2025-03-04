import { expect } from "@playwright/test";
import { isDesktopViewport } from "../utils/isDekstopViewport.js";

export class Navigation {
    constructor(page) {
        this.page = page;
        this.checkoutButton = page.getByRole("link", { name: "Checkout" });

        this.basketCounter = page.locator('[data-qa="header-basket-count"]');
        this.burgerButton = page.locator('[data-qa="burger-button"]');
    }
    getBasketCount = async () => {
        await this.basketCounter.waitFor();
        const text = await this.basketCounter.innerText();
        const asNumber = parseInt(text, 10);
        return asNumber;
    };
    goToCheckout = async () => {
        if (!isDesktopViewport(this.page)) {
            this.burgerButton.waitFor();
            this.burgerButton.click();
        }

        await this.checkoutButton.waitFor({ state: "visible", timeout: 10000 });

        await this.checkoutButton.click();
        await this.page.waitForURL("/basket");
    };
}
