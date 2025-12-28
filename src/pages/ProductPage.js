const { expect } = require("@playwright/test");

class ProductPage {
  constructor(page) {
    this.page = page;
    this.detailsForm = page.locator("#product-details-form");
    this.addToCartBtn = this.detailsForm.locator("input.add-to-cart-button");
    this.notification = page.locator("#bar-notification");
  }

  async addToCart() {
    await this.detailsForm.waitFor({ state: "visible" });
    await this.addToCartBtn.first().click();
    await expect(this.notification).toBeVisible();
  }
}

module.exports = { ProductPage };
