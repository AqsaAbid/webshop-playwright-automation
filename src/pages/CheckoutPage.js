const { expect } = require("@playwright/test");

class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  billingField(label) {
    return this.page.locator("#billing-new-address-form").getByLabel(label);
  }

  shippingField(label) {
    return this.page.locator("#shipping-new-address-form").getByLabel(label);
  }

  async fillBilling(billing) {
  const addressSelect = this.page.locator("#billing-address-select");
  const form = this.page.locator("#billing-new-address-form");

  await expect(addressSelect).toBeVisible();

  // Force "New Address" (value is usually "")
  await addressSelect.selectOption({ value: "" });

  // Guardrails so it never silently continues with old address
  await expect(addressSelect).toHaveValue("");
  await expect(form).toBeVisible({ timeout: 15000 });
  await expect(this.billingField(/first name/i)).toBeVisible({ timeout: 15000 });

  // Fill
  await this.billingField(/first name/i).fill(billing.firstName);
  await this.billingField(/last name/i).fill(billing.lastName);

  const emailField = this.billingField(/email/i);
  if (await emailField.isVisible()) await emailField.fill(billing.email);

  const countryField = this.billingField(/country/i);
  if (await countryField.isVisible()) {
    await countryField.selectOption({ label: billing.country });
  }

  await this.billingField(/city/i).fill(billing.city);
  await this.billingField(/address 1/i).fill(billing.address1);
  await this.billingField(/zip/i).fill(billing.zip);
  await this.billingField(/phone/i).fill(billing.phone);

  // Ideally click Continue inside billing step (recommended)
  await this.clickContinue();
}

  async chooseShippingAddress(billing) {
  const shippingStep = this.page.locator("#checkout-step-shipping");
  const addressSelect = this.page.locator("#shipping-address-select");
  const form = this.page.locator("#shipping-new-address-form");

  // Shipping step might be collapsed until billing is continued
  await expect(shippingStep).toBeVisible({ timeout: 20000 });

  // If dropdown exists, force "New Address"
  if (await addressSelect.isVisible().catch(() => false)) {
    // Prefer selecting by value (usually empty string)
    await addressSelect.selectOption({ value: "" }).catch(async () => {
      // Fallback to label if needed
      await addressSelect.selectOption({ label: "New Address" });
    });

    // Guardrail: ensure we really selected "New Address"
    // (Often value becomes "" when New Address is selected)
    await expect(form).toBeVisible({ timeout: 15000 });
    await expect(this.shippingField(/first name/i)).toBeVisible({ timeout: 15000 });

    // Fill shipping form
    await this.shippingField(/first name/i).fill(billing.firstName);
    await this.shippingField(/last name/i).fill(billing.lastName);

    const emailField = this.shippingField(/email/i);
    if (await emailField.isVisible().catch(() => false)) {
      await emailField.fill(billing.email);
    }

    const countryField = this.shippingField(/country/i);
    if (await countryField.isVisible().catch(() => false)) {
      await countryField.selectOption({ label: billing.country }).catch(() => {});
    }

    await this.shippingField(/city/i).fill(billing.city);
    await this.shippingField(/address 1/i).fill(billing.address1);
    await this.shippingField(/zip/i).fill(billing.zip);
    await this.shippingField(/phone/i).fill(billing.phone);
  }

  // Click Continue INSIDE the shipping step (not global)
  const continueBtn = shippingStep.locator('input[type="button"][value="Continue"]').first();
  await expect(continueBtn).toBeVisible({ timeout: 15000 });
  await expect(continueBtn).toBeEnabled({ timeout: 15000 });
  await continueBtn.click();
}

  async selectShippingMethod() {
    await this.clickContinue();
  }

  async choosePayment(method) {
    if (method === "CashOnDelivery") {
      const cod = this.page.getByLabel(/cash on delivery/i);
      if (await cod.isVisible().catch(() => false)) await cod.check();
    }
    await this.clickContinue();
  }

  async choosePaymentInfo() {
    await this.clickContinue();
  }

  async clickContinue() {
  const continueBtn = this.page.getByRole("button", { name: /^continue$/i });

  await continueBtn.waitFor({ state: "visible" });
  await expect(continueBtn).toBeEnabled();

  await continueBtn.click();
}

  async confirmOrder() {
    const confirmBtn = this.page.getByRole("button", { name: /confirm/i });
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();
  }
}

module.exports = { CheckoutPage };
