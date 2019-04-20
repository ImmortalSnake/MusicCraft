const discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (client, message, args) => {
  if (!client.admins.includes(message.author.id)) return message.reply ('you are not allowed to use this command');
  let users = db.all().filter(d => d.ID.startsWith('inventory'))
  let embed = client.embed(message)
  .setTitle('Backup Success!')
  .attachFiles([{
    attachment: '/app/json.sqlite',
    name: '../../json.sqlite'
  }])
  .setDescription(`wew.. gotta put something here
**${users.length}** player datas saved!`)
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