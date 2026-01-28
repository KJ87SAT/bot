require("dotenv").config();

const {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
  Events
} = require("discord.js");
const fs = require("fs");
const path = require("path");

/* ===== Client ===== */
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

/* ===== コマンド読み込み ===== */
const commands = [];
const commandsPath = path.join(__dirname, "..", "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

/* ===== 起動 & 自動登録 ===== */
client.once(Events.ClientReady, async c => {
  console.log(`ログイン完了: ${c.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("スラッシュコマンド登録中…");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("登録完了！");
  } catch (error) {
    console.error(error);
  }
});

/* ===== Interaction 処理（重要） ===== */
client.on(Events.InteractionCreate, async interaction => {

  // ===== スラッシュコマンド =====
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (!interaction.replied) {
        await interaction.reply({
          content: "エラーが発生しました",
          ephemeral: true
        });
      }
    }
  }

  // ===== モーダル送信 =====
  if (interaction.isModalSubmit()) {
    if (interaction.customId === "qrModal") {
      const command = client.commands.get("qr");
      if (!command?.modalSubmit) return;

      try {
        await command.modalSubmit(interaction);
      } catch (error) {
        console.error(error);
        if (!interaction.replied) {
          await interaction.reply({
            content: "QRコード生成中にエラーが発生しました",
            ephemeral: true
          });
        }
      }
    }
  }
});

client.login(process.env.TOKEN);
