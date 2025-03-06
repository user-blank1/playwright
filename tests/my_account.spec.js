//this function opens the .env file
import { test } from "@playwright/test";
import { MyAccountPage } from "../page-objects/MyAccountPage.js";
import { getLoginToken } from "../api-calls/getLoginToken.js";
import { admin } from "../data/userDetails.js";

test.only("My account cookie injection and mocking network request", async ({ page }) => {
    //first we need a login token
    const loginToken = await getLoginToken(admin.username, admin.password);
    page.route("**/api/user**", async (route, request) => {
        await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ message: "PLAYWRIGHT ERROR FROM MOCKING" }),
        });
    });

    //inject the token into the browser
    const myAccount = new MyAccountPage(page);
    await myAccount.visit();

    await page.evaluate(
        ([loginTokenInsideBrowserCode]) => {
            document.cookie = "token=" + loginTokenInsideBrowserCode;
        },
        [loginToken]
    );
    await myAccount.visit();
    await myAccount.waitForErrorMessage();
});
