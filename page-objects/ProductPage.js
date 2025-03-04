import { expect } from "@playwright/test";
import { Navigation } from "./navigation.js";
import { isDesktopViewport } from "../utils/isDekstopViewport.js";

export class ProductsPage {
    constructor(page) {
        this.page = page;
        this.addButtons = page.locator('[data-qa="product-button"]');
        this.basketCounter = page.locator('[data-qa="header-basket-count"]');
        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]');
        this.pricesList = page.locator(".product-price");
    }
    visit = async () => {
        await this.page.goto("/");
    };

    addProductsToBasket = async (index) => {
        const specificAddButton = this.addButtons.nth(index);
        await specificAddButton.waitFor();
        await expect(specificAddButton).toHaveText("Add to Basket");

        const navigation = new Navigation(this.page);

        //only run on desktop
        let basketCountBeforeAdding;
        if (isDesktopViewport(this.page)) {
            basketCountBeforeAdding = await navigation.getBasketCount();
        }

        await specificAddButton.click();

        //only run on desktop
        if (isDesktopViewport(this.page)) {
            const basketCountAfterAdding = await navigation.getBasketCount();
            expect(basketCountAfterAdding > basketCountBeforeAdding);
        }

        await expect(specificAddButton).toHaveText("Remove from Basket");
    };
    sortByCheapest = async () => {
        await this.sortDropdown.waitFor();
        await this.pricesList.nth(4).waitFor();
        const pricesBefore = await this.pricesList.allTextContents();

        await this.sortDropdown.selectOption("price-asc");
        const pricesAfter = await this.pricesList.allTextContents();
        expect(pricesAfter).not.toEqual(pricesBefore);
    };
}
