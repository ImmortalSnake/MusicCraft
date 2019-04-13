exports.run = async (client, message, args) => {// eslint-disable-line no-unused-vars
if (message.author.id !== client.owner) return message.reply ('you are not allowed to use this command')
  await message.reply("Bot is shutting down.");
  client.commands.forEach( async cmd => {
   // await client.unloadCommand(cmd);
  });
  return client.destroy();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reboot",
  group: "owner",
  description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
  usage: "reboot"
};