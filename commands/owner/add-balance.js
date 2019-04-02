const db = require('quick.db');
const sort = require('array-sort');

module.exports.run = async (client, message, args, color, prefix) => {
  if(!client.admins.includes(message.author.id)) return message.reply ('you are not allowed to use this command')
  let user = client.users.get(args[0])
  if(!user.id) return message.channel.send('Could not find that user')
  let amount = parseInt(args[1])
  if(!amount) return message.channel.send('Specify an amount')
  let result = await db.add(`balance_${user.id}`, amount)
  message.channel.send('Added ' + amount + ' to ' + user.username)
};


exports.conf = {
  aliases: [],
};

// Name is the only necessary one.
exports.help = {
  name: 'add-balance',
  description: 'Evaluates a JS code.',
  usage: 'eval',
  group: 'owner'
}