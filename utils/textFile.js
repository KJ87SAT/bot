const { Buffer } = require("buffer");

function createTextFile(text) {
  return Buffer.from(text, "utf-8");
}

module.exports = { createTextFile };
