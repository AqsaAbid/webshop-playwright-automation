const { expect } = require("@playwright/test");
const { parseMoney, round2 } = require("../utils/money");

// CartPage encapsulates operations on the Shopping Cart page
// and includes helpers to validate price calculations.

class CartPage {
  constructor(page) {
    this.page = page;
    // All cart line rows (each product in the cart)
    this.rows = page.locator("table.cart tbody tr");
    // Button that triggers quantity/line total recalculation
    this.updateBtn = page.getByRole("button", { name: /update shopping cart/i });
    // Terms of service checkbox required before checkout
    this.terms = page.locator("#termsofservice");
    // Checkout button moves to the checkout flow (unique id)
    this.checkoutBtn = page.locator('#checkout');
  }

  async setQuantity(productNameContains, qty) {
    // Locate the row whose product link text contains the provided name.
    const row = this.page.locator("table.cart tbody tr", {
      has: this.page.getByRole("link", { name: new RegExp(productNameContains, "i") })
    }).first();

    await expect(row).toBeVisible();
    // Update the quantity input and apply changes.
    await row.locator("input.qty-input").fill(String(qty));
    await this.updateBtn.click();
  }

  async readLines() {
    // Read all cart lines and normalize their numeric values.
    const count = await this.rows.count();
    const lines = [];

    for (let i = 0; i < count; i++) {
      const row = this.rows.nth(i);
      const name = (await row.locator(".product-name").innerText()).trim();
      // `parseMoney` turns currency text (e.g., "$12.34") into a number.
      const unitPrice = parseMoney(await row.locator(".unit-price").innerText());
      const qty = Number(await row.locator("input.qty-input").inputValue());
      const lineTotal = parseMoney(await row.locator(".subtotal").innerText());

      lines.push({ name, unitPrice, qty, lineTotal });
    }
    return lines;
  }

  async assertLineMath() {
    // Verify each line total equals unit price × quantity (rounded to 2 decimals).
    const lines = await this.readLines();
    for (const l of lines) {
      const expected = round2(l.unitPrice * l.qty);
      expect(round2(l.lineTotal)).toBe(expected);
    }
  }

  async assertCartSubtotalEqualsSum() {
    // Verify the cart Sub-Total equals the sum of all line totals.
    const lines = await this.readLines();
    const expectedSum = round2(lines.reduce((acc, l) => acc + l.lineTotal, 0));

    const subtotalText = await this.page
      .locator(".cart-total tr", { hasText: "Sub-Total" })
      .locator(".cart-total-right")
      .innerText();

    const uiSubtotal = round2(parseMoney(subtotalText));
    expect(uiSubtotal).toBe(expectedSum);
  }

  async proceedToCheckout() {
    // Accept terms and start the checkout process.
    await this.terms.check();
    await expect(this.checkoutBtn).toBeVisible();
    await expect(this.checkoutBtn).toBeEnabled();
    await this.checkoutBtn.click();
  }
}

module.exports = { CartPage };
