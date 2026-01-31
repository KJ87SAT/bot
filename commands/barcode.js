const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder
} = require("discord.js");

const { generateUserIdBarcode } = require("../utils/barcode");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("barcode")
    .setDescription("バーコードを生成します")
    .addSubcommand(sub =>
      sub
        .setName("user")
        .setDescription("ユーザーIDをバーコード化")
        .addUserOption(option =>
          option
            .setName("user")
            .setDescription("対象ユーザー（省略可）")
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub !== "user") return;

    const user =
      interaction.options.getUser("user") ?? interaction.user;

    // タイムアウト防止
    await interaction.deferReply();

    try {
      const barcodeBuffer = await generateUserIdBarcode(user.id);

      const attachment = new AttachmentBuilder(barcodeBuffer, {
        name: "userid-barcode.png"
      });

      const embed = new EmbedBuilder()
        .setTitle("📦 ユーザーID バーコード")
        .setDescription(
          `**ユーザー:** ${user.tag}\n` +
          `**ID:** \`${user.id}\``
        )
        .setImage("attachment://userid-barcode.png")
        .setColor(0x2b2d31);

      await interaction.editReply({
        embeds: [embed],
        files: [attachment]
      });

    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: "❌ バーコード生成に失敗しました"
      });
    }
  }
};
