const dotenv = require("dotenv");
dotenv.config();

const baseUrl = process.env.BASE_URL || "https://demowebshop.tricentis.com";
const email = process.env.DEMO_EMAIL || "aqsademo@gmail.com";
const password = process.env.DEMO_PASSWORD || "demo123";

if (!process.env.DEMO_EMAIL || !process.env.DEMO_PASSWORD) {
  console.warn("[env] DEMO_EMAIL/DEMO_PASSWORD not set; using fallback credentials.");
}

module.exports = { baseUrl, email, password };
