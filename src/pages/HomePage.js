const { expect } = require("@playwright/test");

class HomePage {
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator("#small-searchterms, input[name='q']");
    this.searchButton = page.getByRole("button", { name: /search/i });
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.cartLink = page.locator(".header-links .ico-cart").first();
    this.accountLink = page.locator(".header-links").getByRole("link").first(); // usually email after login
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.page).toHaveTitle(/Demo Web Shop/i);
  }

  async openLogin() {
    await this.loginLink.click();
  }

  async search(term) {
    await this.searchBox.waitFor({ state: "visible" });
    await this.searchBox.fill(term);
    await this.searchButton.click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async assertLoggedIn(email) {
    // After login, header shows the email as a link
    await expect(this.page.getByRole("link", { name: email})).toBeVisible();
  }
}

module.exports = { HomePage };
