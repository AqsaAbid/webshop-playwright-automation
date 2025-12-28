function parseMoney(text) {
  // Example "$1,234.56" -> 1234.56
  const cleaned = text.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  const value = Number(cleaned);
  if (Number.isNaN(value)) throw new Error(`Could not parse money from: "${text}"`);
  return value;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

module.exports = { parseMoney, round2 };
