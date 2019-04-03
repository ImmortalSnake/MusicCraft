const db = require('quick.db')
const discord = require('discord.js')
exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have food .Use the `s!start` command to get food');
  let a = args.join(' ').toProperCase()
  let f = inventory.food[a]
  if(!f) return message.channel.send('Could not find that food in your inventory. Use `s!eat [food]` to eat food and use `s!inv` to see all the food you have in your inventory')
  let food = client.items.food[a]
  console.log(food)
  let embed = new discord.MessageEmbed()
  .setTitle('Eat')
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setColor('#206694')
  .setDescription(`You ate a ${a} ${food.emote}.
You got ${food.energy}+ Energy!`)
  message.channel.send(embed)
  inventory.hunger += food.energy
  inventory.food[a] --
await db.set(`inventory_${message.author.id}`, inventory)
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