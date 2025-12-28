const fs = require("fs");
const path = require("path");

function loadJson(relativePath) {
  const fullPath = path.resolve(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
}

module.exports = { loadJson };
