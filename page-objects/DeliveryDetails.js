import { expect } from "@playwright/test";

export class DeliveryDetails {
    constructor(page) {
        this.page = page;
        this.nameInput = page.getByRole("textbox", { name: "First name" });
        this.surnameInput = page.getByRole("textbox", { name: "Last name" });
        this.streetInput = page.getByRole("textbox", { name: "Street" });
        this.postCodeInput = page.getByRole("textbox", { name: "Post code" });
        this.cityInput = page.getByRole("textbox", { name: "City" });
        this.countryDropdown = page.getByRole("combobox");
        this.saveAddressButton = page.getByRole("button", {
            name: "Save address for next time",
        });

        this.savedAddressContainer = page.locator(
            '[data-qa="saved-address-container"]'
        );

        this.savedAddressFirstName = page.locator(
            '[data-qa="saved-address-firstName"]'
        );
        this.savedAddressLastName = page.locator(
            '[data-qa="saved-address-lastName"]'
        );
        this.savedAddressStreet = page.locator(
            '[data-qa="saved-address-street"]'
        );
        this.savedAddressPostCode = page.locator(
            '[data-qa="saved-address-postcode"]'
        );
        this.savedAddressCity = page.locator('[data-qa="saved-address-city"]');
        this.savedAddressCountry = page.locator(
            '[data-qa="saved-address-country"]'
        );

        this.continueToPaymentButton = page.getByRole("button", {
            name: "Continue to payment",
        });
    }
    fillDetails = async (userAddress) => {
        await this.countryDropdown.waitFor();
        await this.countryDropdown.waitFor();
        await this.nameInput.waitFor();
        await this.surnameInput.waitFor();
        await this.streetInput.waitFor();
        await this.postCodeInput.waitFor();
        await this.cityInput.waitFor();

        await this.countryDropdown.selectOption(userAddress.country);
        await this.nameInput.fill(userAddress.name);
        await this.surnameInput.fill(userAddress.surname);
        await this.streetInput.fill(userAddress.street);
        await this.postCodeInput.fill(userAddress.postCode);
        await this.cityInput.fill(userAddress.city);
    };

    saveDetails = async () => {
        const addressCountBeforeSaving =
            await this.savedAddressContainer.count();

        await this.saveAddressButton.waitFor();
        await this.saveAddressButton.click();
        await this.savedAddressContainer.waitFor();

        await expect(this.savedAddressContainer).toHaveCount(
            addressCountBeforeSaving + 1
        );

        await this.savedAddressFirstName.first().waitFor();
        expect(await this.savedAddressFirstName.first().innerText()).toBe(
            await this.nameInput.inputValue()
        );

        await this.savedAddressLastName.first().waitFor();
        expect(await this.savedAddressLastName.first().innerText()).toBe(
            await this.surnameInput.inputValue()
        );

        await this.savedAddressStreet.first().waitFor();
        expect(await this.savedAddressStreet.first().innerText()).toBe(
            await this.streetInput.inputValue()
        );

        await this.savedAddressPostCode.first().waitFor();
        expect(await this.savedAddressPostCode.first().innerText()).toBe(
            await this.postCodeInput.inputValue()
        );

        await this.savedAddressCity.first().waitFor();
        expect(await this.savedAddressCity.first().innerText()).toBe(
            await this.cityInput.inputValue()
        );

        await this.savedAddressCountry.first().waitFor();
        expect(await this.savedAddressCountry.first().innerText()).toBe(
            await this.countryDropdown.inputValue()
        );
    };

    continueToPayment = async () => {
        await this.continueToPaymentButton.waitFor();
        await this.continueToPaymentButton.click();
        await this.page.waitForURL(/\/payment/, { timeout: 3000 });
    };
}
