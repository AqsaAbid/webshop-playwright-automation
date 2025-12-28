const { test } = require("@playwright/test");
const { loadJson } = require("../src/utils/testData");
const { email, password } = require("../src/utils/env");

const { HomePage } = require("../src/pages/HomePage");
const { LoginPage } = require("../src/pages/LoginPage");
const { SearchResultsPage } = require("../src/pages/SearchResultsPage");
const { ProductPage } = require("../src/pages/ProductPage");
const { CartPage } = require("../src/pages/CartPage");
const { CheckoutPage } = require("../src/pages/CheckoutPage");
const { OrderSuccessPage } = require("../src/pages/OrderSuccessPage");

test.describe("Place order with multiple products (price calculation checks) - Logged in", () => {
  test("should login, add multiple products, validate totals, and place order", async ({ page }) => {
    const data = loadJson("test-data/order-multiple-products.json");

    const home = new HomePage(page);
    const login = new LoginPage(page);
    const results = new SearchResultsPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const success = new OrderSuccessPage(page);

    await home.goto();

    // Login
    await home.openLogin();
    await login.assertLoaded();
    await login.login(email, password);
    await home.assertLoggedIn(email);

    // Add each product
    for (const p of data.products) {
      await home.search(p.searchTerm);
      await results.openProductByName(p.searchTerm);
      await product.addToCart();
      await page.goto("/");
    }

    // Cart -> set quantities
    await home.openCart();
    for (const p of data.products) {
      await cart.setQuantity(p.searchTerm, p.quantity);
    }

    // Price checks
    await cart.assertLineMath();
    await cart.assertCartSubtotalEqualsSum();

    // Checkout
    await cart.proceedToCheckout();
    await checkout.fillBilling(data.billing);
    await checkout.chooseShippingAddress(data.billing);
    await checkout.selectShippingMethod();
    await checkout.choosePayment();
    await checkout.choosePaymentInfo();
    await checkout.confirmOrder();

    await success.assertSuccess();
  });
});
