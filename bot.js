const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const { DirectMessages, MessageContent, DirectMessageTyping, Guilds, GuildPresences, GuildMessages } = GatewayIntentBits;
const { User, Message, Channel, GuildMember } = Partials;

const mongoose = require('mongoose');
const Kayit = require('./models/kayit');

const config = require("./config");

const client = new Client({
  intents: [DirectMessages, MessageContent, DirectMessageTyping, Guilds, GuildPresences, GuildMessages],
  partials: [User, Message, Channel, GuildMember],
});

client.commands = new Collection();
client.Button = new Collection();
client.ContextMenu = new Collection();
client.ModalSubmit = new Collection();
client.SelectMenu = new Collection();

mongoose.connect('mongodb://localhost:27017/kayit-verileri', { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
  try {
    await client.login(process.env.TOKEN || config.token);
    console.log('Bot logged in successfully!');

    // Load events and interactions
    await Promise.all([
      require('./handler/eventHandler').loadEvents(client),
      require('./handler/InteractionHandler').loadInteraction(client),
    ]);

    console.log('Events and interactions loaded successfully!');
  } catch (error) {
    console.error('Error logging in:', error.stack);
  }
}

main();

process.on('unhandledRejection', async error => {
  console.error('Unhandled rejection:', error.stack);
});

process.on('uncaughtException', async error => {
  console.error('Uncaught exception:', error.stack);
});