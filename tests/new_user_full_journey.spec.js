import { test, expect } from "@playwright/test";
import { ProductsPage } from "../page-objects/ProductPage";
import { Navigation } from "../page-objects/navigation.js";
import { Checkout } from "../page-objects/Checkout.js";
import { LoginPage } from "../page-objects/LoginPage.js";
import { RegisterPage } from "../page-objects/RegisterPage.js";
import { v4 as uuidv4 } from "uuid";
import { DeliveryDetails } from "../page-objects/DeliveryDetails.js";
import { deliveryDetails as userAddress } from "../data/deliveryDetails2.js";
import { PaymentPage } from "../page-objects/PaymentPage.js";
import { paymentDetails } from "../data/paymentDetails.js";

test("New Use full end-to-end journey", async ({ page }) => {
    //product page visit
    const productsPage = new ProductsPage(page);
    await productsPage.visit();
    await productsPage.sortByCheapest();
    await productsPage.addProductsToBasket(0);
    await productsPage.addProductsToBasket(1);
    await productsPage.addProductsToBasket(2);
    const navigation = new Navigation(page);
    await navigation.goToCheckout();

    const checkout = new Checkout(page);
    await checkout.removeCheapestProduct();
    await checkout.continueToCheckout();

    const login = new LoginPage(page);
    await login.moveToSignup();

    const registerPage = new RegisterPage(page);
    const emailId = uuidv4();
    const email = emailId + "@email.com";
    await registerPage.signUpAsNewUser(email);

    const deliveryDetails = new DeliveryDetails(page);
    await deliveryDetails.fillDetails(userAddress);
    await deliveryDetails.saveDetails();

    await deliveryDetails.continueToPayment();

    const paymentPage = new PaymentPage(page);
    await paymentPage.activateDiscount();

    await paymentPage.fillPaymentDetails(paymentDetails);
    await paymentPage.completePayment();
});
