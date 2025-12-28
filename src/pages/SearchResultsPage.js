const { expect } = require("@playwright/test");

class SearchResultsPage {
  constructor(page) {
    this.page = page;
  }

  async openProductByName(nameContains) {
    const productLink = this.page.getByRole("link", { name: nameContains }).first();
    await expect(productLink).toBeVisible();
    await productLink.click();
  }
}

module.exports = { SearchResultsPage };
