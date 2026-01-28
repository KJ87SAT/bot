const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const os = require("os");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Botの情報を表示します"),

  async execute(interaction) {
    const client = interaction.client;

    // Ping
    const wsPing = client.ws.ping;
    const apiPing = Date.now() - interaction.createdTimestamp;

    // 稼働時間
    const uptime = client.uptime;
    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor(uptime / 3600000) % 24;
    const minutes = Math.floor(uptime / 60000) % 60;
    const seconds = Math.floor(uptime / 1000) % 60;

    // メモリ
    const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const embed = new EmbedBuilder()
      .setTitle("🤖 Bot Information")
      .setColor(0x5865F2)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: "📡 WebSocket Ping", value: `${wsPing} ms`, inline: true },
        { name: "⚡ API Ping", value: `${apiPing} ms`, inline: true },
        {
          name: "⏱ Uptime",
          value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          inline: false
        },
        { name: "🧠 Memory Usage", value: `${memoryUsed} MB`, inline: true },
        { name: "🖥 Node.js", value: process.version, inline: true },
        { name: "📦 discord.js", value: require("discord.js").version, inline: true },
        { name: "🌐 Servers", value: `${client.guilds.cache.size}`, inline: true },
        { name: "👥 Users", value: `${client.users.cache.size}`, inline: true },
        { name: "💻 Platform", value: `${os.platform()} (${os.arch()})`, inline: true }
      )
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  }
};
