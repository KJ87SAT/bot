const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  AttachmentBuilder
} = require("discord.js");

const { generateQRCode } = require("../utils/qrcode");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qr")
    .setDescription("フォームから入力してQRコードを作成します"),

  // /qr 実行時
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("qrModal")
      .setTitle("QRコード作成");

    const textInput = new TextInputBuilder()
      .setCustomId("qrText")
      .setLabel("QRコードにする文章 / URL")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("https://example.com")
      .setRequired(true)
      .setMaxLength(1000);

    const row = new ActionRowBuilder().addComponents(textInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  },

  // フォーム送信時
  async modalSubmit(interaction) {
    const text = interaction.fields.getTextInputValue("qrText");

    const qrBuffer = await generateQRCode(text);

    const attachment = new AttachmentBuilder(qrBuffer, {
      name: "qrcode.png"
    });

    await interaction.reply({
      content: "📱 QRコードを生成しました",
      files: [attachment]
    });
  }
};
