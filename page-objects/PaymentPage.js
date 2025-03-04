import { expect } from "@playwright/test";
export class PaymentPage {
    constructor(page) {
        this.page = page;
        this.iframe = page.frameLocator(".active-discount-container").locator('[data-qa="discount-code"]');
        //discount input element
        this.discountInput = page.locator('div form.rounded [data-qa="discount-code-input"]');
        this.submitDiscountButton = page.locator('[data-qa="submit-discount-button"]');
        this.discountActivationMessage = page.locator('[data-qa="discount-active-message"]');
        this.newPrice = page.locator('[data-qa="total-with-discount-value"]');
        this.totalPriceBeforeDiscount = page.locator('[data-qa="total-value"]');

        this.cardOwner = page.locator('[data-qa="credit-card-owner"]');
        this.cardNumber = page.locator('[data-qa="credit-card-number"]');
        this.validUntil = page.locator('[data-qa="valid-until"]');
        this.cVC = page.locator('[data-qa="credit-card-cvc"]');
        this.payButton = page.locator('[data-qa="pay-button"]');
        this.payButton = page.getByRole("button", { name: "Pay" });
    }

    activateDiscount = async () => {
        await this.iframe.waitFor();
        const code = await this.iframe.innerText();
        await this.discountInput.waitFor();

        //option1

        await this.discountInput.fill(code);
        await expect(this.discountInput).toHaveValue(code);

        //option2
        /*
        await this.discountInput.focus();
        await this.page.keyboard.type(code, { delay: 1000 });
        expect(await this.discountInput.inputValue()).toBe(code);*/

        await this.submitDiscountButton.waitFor();
        expect(await this.discountActivationMessage.isVisible()).toBe(false);
        await this.submitDiscountButton.click();

        await this.discountActivationMessage.waitFor();
        await expect(this.discountActivationMessage).toHaveText("Discount activated!");

        await this.newPrice.waitFor();
        await this.totalPriceBeforeDiscount.waitFor();

        const after1 = await this.newPrice.innerText();
        const before1 = await this.totalPriceBeforeDiscount.innerText();

        let after = parseFloat(after1.replace("$", ""));
        let before = parseFloat(before1.replace("$", ""));

        expect(before).toBeGreaterThan(after);
    };

    fillPaymentDetails = async (paymentDetails) => {
        await this.cardOwner.waitFor();
        await this.cardNumber.waitFor();
        await this.cVC.waitFor();
        await this.validUntil.waitFor();
        await this.payButton.waitFor();

        await this.cardOwner.fill(paymentDetails.name);
        await this.cardNumber.fill(paymentDetails.cardNumber);
        await this.validUntil.fill(paymentDetails.validUntil);
        await this.cVC.fill(paymentDetails.cVC);

        await this.payButton.waitFor();
        await this.payButton.click();
    };
    completePayment = async () => {
        await this.page.waitForURL(/\/thank-you/);
    };
}
