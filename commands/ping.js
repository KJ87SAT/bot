const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping情報を表示します"),

  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Ping計測中...",
      fetchReply: true
    });

    const apiLatency = sent.createdTimestamp - interaction.createdTimestamp;
    const wsPing = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle("計測結果")
      .setColor(0x5865F2) // Discord Blurple
      .addFields(
        {
          name: "📡 WebSocket Ping",
          value: `${wsPing}ms`,
          inline: true
        },
        {
          name: "⚡ API レスポンス",
          value: `${apiLatency}ms`,
          inline: true
        },
        {
          name: "🤖 BOT",
          value: interaction.client.user.tag,
          inline: false
        }
      )
      .setTimestamp();

    await interaction.editReply({
      content: null,
      embeds: [embed]
    });
  }
};
