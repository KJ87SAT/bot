const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  AttachmentBuilder
} = require("discord.js");

const { createTextFile } = require("../utils/textFile");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("txt")
    .setDescription("ファイル名を指定して .txt を作成します"),

  /* ===== /txt 実行 ===== */
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("txtModal")
      .setTitle("テキストファイル作成");

    const fileNameInput = new TextInputBuilder()
      .setCustomId("fileName")
      .setLabel("ファイル名（拡張子不要）")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(50)
      .setPlaceholder("example");

    const textInput = new TextInputBuilder()
      .setCustomId("txtContent")
      .setLabel("ファイルの内容")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(4000);

    modal.addComponents(
      new ActionRowBuilder().addComponents(fileNameInput),
      new ActionRowBuilder().addComponents(textInput)
    );

    await interaction.showModal(modal);
  },

  /* ===== モーダル送信 ===== */
  async modalSubmit(interaction) {
    if (interaction.customId !== "txtModal") return;

    let fileName = interaction.fields.getTextInputValue("fileName");
    const text = interaction.fields.getTextInputValue("txtContent");

    // 危険な文字を除去
    fileName = fileName
      .replace(/[\\/:*?"<>|]/g, "")
      .trim();

    if (!fileName) {
      return interaction.reply({
        content: "❌ ファイル名が不正です",
        ephemeral: true
      });
    }

    const buffer = createTextFile(text);

    const attachment = new AttachmentBuilder(buffer, {
      name: `${fileName}.txt`
    });

    await interaction.reply({
      content: `📄 **${fileName}.txt** を作成しました`,
      files: [attachment]
    });
  }
};
