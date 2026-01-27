const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const QRCode = require("qrcode");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qr")
    .setDescription("テキストやURLをQRコードに変換します")
    .addStringOption(option =>
      option
        .setName("text")
        .setDescription("QRコードにする文字列 / URL")
        .setRequired(true)
    ),

  async execute(interaction) {
    const text = interaction.options.getString("text");

    try {
      // QRコードを Buffer として生成
      const qrBuffer = await QRCode.toBuffer(text, {
        type: "png",
        width: 512,
        errorCorrectionLevel: "H"
      });

      const attachment = new AttachmentBuilder(qrBuffer, {
        name: "qrcode.png"
      });

      await interaction.reply({
        content: "📱 QRコードを生成しました",
        files: [attachment]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "QRコードの生成に失敗しました",
        ephemeral: true
      });
    }
  }
};
