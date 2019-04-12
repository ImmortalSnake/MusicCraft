const discord = require('discord.js');

module.exports.run = async (client, message, args, color, prefix) => {
  if (!client.admins.includes(message.author.id)) return message.reply ('you are not allowed to use this command')
  let embed = new discord.MessageEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setTitle('Backup Success!')
  .setColor('GREEN')
  .setDescription('wew.. gotta put something here')
  .attachFiles([{
    attachment: '/app/json.sqlite',
    name: '../../json.sqlite'
  }])
  message.channel.send(embed)
};


exports.conf = {
  aliases: [],
};

// Name is the only necessary one.
exports.help = {
  name: 'backup',
  description: 'Evaluates a JS code.',
  usage: 'eval',
  group: 'owner'
}