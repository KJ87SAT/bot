const { Client, GatewayIntentBits, Collection } = require("discord.js")
const fs = require("fs")
const path = require("path")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();

//mainの1つ上(root)にある commandsを参照

const commandsPath = path.join(__dirname, "..", "commands");
const commandsFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

for (const file of commandsFiles) {
    const filepath = path.join(commandsPath, file);
    const command = require(filepath);
    client.commands.set(command.name, command);
}

client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (!message.content.startsWith("!")) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift();

    const command = client.commands.get(commandName);
    if (!command) return;
    
    command.execute(message, args);
});

client.once("ready", () => {
    console.log(`ログイン完了しました。: ${client.user.tag}`);
});

client.login("TOKEN");