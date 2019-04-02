const db = require('quick.db')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have food .Use the `s!start` command to get food');
  let f = inventory.food[args.join(' ')]
  if(!f) return
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'eat',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}