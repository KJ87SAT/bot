const bwipjs = require("bwip-js");

async function generateUserIdBarcode(userId) {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code128",
        text: userId,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
        includetext: false,        // ← 下の文字を消す
        backgroundcolor: "FFFFFF", // 白背景
        barcolor: "000000"         // バーは黒（明示）
      },
      (err, png) => {
        if (err) reject(err);
        else resolve(png);
      }
    );
  });
}

module.exports = {
  generateUserIdBarcode
};
