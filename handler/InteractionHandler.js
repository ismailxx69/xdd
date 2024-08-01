const config = require('../config');
const fs = require('fs');
const ascii = require('ascii-table');

function loadInteraction(client) {
  const table = new ascii().setHeading("Interaction", "Status", "Type");

  let contextMenusArray = [];
  let developerArray = [];

  const commandsFolders = fs.readdirSync("./commands");
  for (const folder of commandsFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const commandFile = require(`../commands/${folder}/${file}`);

      if (!commandFile.data) {
        console.error(`Invalid command file: ${file}`);
        continue;
      }

      client.commands.set(commandFile.data.name, commandFile);

      if (commandFile.developer) developerArray.push(commandFile.data.toJSON());
      else contextMenusArray.push(commandFile.data.toJSON());

      table.addRow(file, "✔️", "SlashCommand");
    }
  }

  const interactionsFolders = fs.readdirSync("./interaction");
  for (const folder of interactionsFolders) {
    switch (folder) {
      case "Button":
      case "ModalSubmit":
      case "SelectMenu":
        const commandFiles = fs.readdirSync(`./interaction/${folder}`).filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
          const commandFile = require(`../interaction/${folder}/${file}`);
          client[folder].set(commandFile.customId, commandFile);
          table.addRow(file, "✔️", folder);
        }
        break;
      case "ContextMenu":
        const contextMenuFiles = fs.readdirSync(`./interaction/${folder}`).filter((file) => file.endsWith(".js"));
        for (const file of contextMenuFiles) {
          const commandFile = require(`../interaction/${folder}/${file}`);
          client.ContextMenu.set(commandFile.data.name, commandFile);
          table.addRow(file, "✔️", folder);
          if (commandFile.developer) developerArray.push(commandFile.data.toJSON());
          else contextMenusArray.push(commandFile.data.toJSON());
        }
        break;
    }
  }

  client.application.commands.set(contextMenusArray);
  const developerGuild = client.guilds.cache.get(config.supportGuild);
  developerGuild.commands.set(developerArray);

  return console.log(table.toString(), "\nInteraction loaded");
}

module.exports = { loadInteraction };