module.exports.run = async (client, message, args, color, prefix) => {
  if (message.author.id !== client.owner) return message.reply ('you are not allowed to use this command')
  if (!args || args.length < 1) return message.reply("Must provide a command to reload. Derp.");
  let response = await client.unloadCommand(args[0]);
  if (response) return message.reply(`Error Unloading: ${response}`);

  response = client.loadCommand(args[0]);
  if (response) return message.reply(`Error Loading: ${response}`);

  message.channel.send(`The command \`${args[0]}\` has been reloaded`);
	}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'reload',
  description: 'Evaluates a JS code.',
  group: 'owner',
  usage: 'reload [command]'
}