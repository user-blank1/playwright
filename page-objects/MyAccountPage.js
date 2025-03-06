export class MyAccountPage {
    constructor(page) {
        this.page = page;
        this.errorMessage = page.locator('[data-qa="error-message"]');
    }

    visit = async () => {
        await this.page.goto("/my-account");
        // await this.page.pause();
    };
    waitForErrorMessage = async () => {
        await this.errorMessage.waitFor();
    };
}
