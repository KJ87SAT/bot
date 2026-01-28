const QRCode = require("qrcode");

/**
 * テキストからQRコードPNG(Buffer)を生成
 * @param {string} text
 * @returns {Promise<Buffer>}
 */
async function generateQRCode(text) {
  return await QRCode.toBuffer(text, {
    type: "png",
    width: 512,
    errorCorrectionLevel: "H"
  });
}

module.exports = {
  generateQRCode
};
