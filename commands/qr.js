const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  AttachmentBuilder
} = require("discord.js");

const { generateQRCode } = require("../utils/qrcode");
const { decodeQRCodeFromURL } = require("../utils/qrDecode");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qr")
    .setDescription("QRコードを作成・解析します")
    .addSubcommand(sub =>
      sub
        .setName("modal")
        .setDescription("フォーム入力でQRコードを作成")
    )
    .addSubcommand(sub =>
      sub
        .setName("file")
        .setDescription("テキストファイルからQRコードを作成")
        .addAttachmentOption(option =>
          option
            .setName("file")
            .setDescription(".txt ファイル")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("decode")
        .setDescription("QRコード画像を文字列に復元")
        .addAttachmentOption(option =>
          option
            .setName("image")
            .setDescription("QRコード画像")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    /* ===== モーダル入力 ===== */
    if (sub === "modal") {
      const modal = new ModalBuilder()
        .setCustomId("qrModal")
        .setTitle("QRコード作成");

      const input = new TextInputBuilder()
        .setCustomId("qrText")
        .setLabel("QRコードにする文章 / URL")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(2000);

      modal.addComponents(
        new ActionRowBuilder().addComponents(input)
      );

      return interaction.showModal(modal);
    }

    /* ===== テキストファイル ===== */
    if (sub === "file") {
      const file = interaction.options.getAttachment("file");

      if (!file.name.endsWith(".txt")) {
        return interaction.reply({
          content: "❌ .txt ファイルのみ対応しています",
          flags: 64
        });
      }

      // ⭐ 作成中表示
      await interaction.deferReply();

      try {
        const res = await fetch(file.url);
        const text = await res.text();

        const qrBuffer = await generateQRCode(text);
        const attachment = new AttachmentBuilder(qrBuffer, {
          name: "qrcode.png"
        });

        return interaction.editReply({
          content: "📄 QRコードを作成しました。",
          files: [attachment]
        });
      } catch (err) {
        console.error(err);
        return interaction.editReply({
          content: "❌ ファイルの読み込みに失敗しました"
        });
      }
    }

    /* ===== QRデコード ===== */
    if (sub === "decode") {
      const image = interaction.options.getAttachment("image");

      if (!image.contentType?.startsWith("image/")) {
        return interaction.reply({
          content: "❌ 画像ファイルを指定してください",
          flags: 64
        });
      }

      // ⭐ 解析中表示（タイムアウト防止）
      await interaction.deferReply();

      try {
        const decodedText = await decodeQRCodeFromURL(image.url);

        return interaction.editReply({
          content:
            "🔍 **QRコード解析結果**\n```" +
            decodedText +
            "```"
        });
      } catch (err) {
        console.error(err);
        return interaction.editReply({
          content: "❌ QRコードを読み取れませんでした"
        });
      }
    }
  },

  /* ===== モーダル送信 ===== */
  async modalSubmit(interaction) {
    if (interaction.customId !== "qrModal") return;

    // ⭐ 作成中表示
    await interaction.deferReply();

    const text = interaction.fields.getTextInputValue("qrText");

    try {
      const qrBuffer = await generateQRCode(text);
      const attachment = new AttachmentBuilder(qrBuffer, {
        name: "qrcode.png"
      });

      await interaction.editReply({
        content: "📝 QRコードを作成しました",
        files: [attachment]
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: "❌ QRコードの作成に失敗しました"
      });
    }
  }
};
