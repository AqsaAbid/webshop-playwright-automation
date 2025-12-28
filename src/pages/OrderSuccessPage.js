const { expect } = require("@playwright/test");

class OrderSuccessPage {
  constructor(page) {
    this.page = page;
  }

  async assertSuccess() {
    await expect(this.page.getByText(/successfully processed/i)).toBeVisible();
  }
}

module.exports = { OrderSuccessPage };
