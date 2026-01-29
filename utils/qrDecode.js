const Jimp = require("jimp");
const jsQR = require("jsqr");

async function decodeQRCodeFromURL(url) {
  const image = await Jimp.Jimp.read(url);

  const { data, width, height } = image.bitmap;

  const code = jsQR(
    new Uint8ClampedArray(data),
    width,
    height
  );

  if (!code) {
    throw new Error("QRコードを検出できませんでした");
  }

  return code.data;
}

module.exports = { decodeQRCodeFromURL };
