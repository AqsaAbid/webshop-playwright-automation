const { defineConfig } = require("@playwright/test");
const { baseUrl } = require("./src/utils/env");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 1,
  use: {
    baseURL: baseUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  reporter: [
    ["html", { open: "never" }],
    ["allure-playwright"]
  ]
});
