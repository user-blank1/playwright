export class RegisterPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.getByRole("textbox", { name: "E-Mail" });
        this.passwordInput = page.getByRole("textbox", { name: "Password" });
        this.registerButton = page.getByRole("button", { name: "Register" });
    }

    signUpAsNewUser = async (email) => {
        //email input
        await this.emailInput.waitFor();

        await this.emailInput.fill(email);
        //psw input
        await this.passwordInput.fill("password1");
        //register btn
        await this.registerButton.click();
    };
}
