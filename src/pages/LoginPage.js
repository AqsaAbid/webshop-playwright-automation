const { expect } = require("@playwright/test");

class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByLabel(/email/i);
    this.password = page.getByLabel(/password/i);
    this.loginButton = page.getByRole("button", { name: /Log in/i });
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/login/i);
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
