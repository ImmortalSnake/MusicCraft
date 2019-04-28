const db = require('quick.db');
const discord = require('discord.js')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a pickaxe .Use the `s!start` command to get a pickaxe')
  let pickaxe = inventory.equipped.pickaxe
  if(!pickaxe) return message.channel.send('You do not have a pickaxe. Chop some wood with `s!chop` and craft a pickaxe using `s!craft`')
  if(inventory.hunger <= 5) return message.channel.send('You are too hungry. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food or wait until your hunger reaches back to 100')

  inventory = await client.checkInventory(message.author)
  if(Date.now() - inventory.lastactivity >= client.utils.rhunger && inventory.hunger < 75) inventory.hunger += 25
  if(inventory.hunger %2 === 0 && inventory.hunger <= 25) await message.channel.send('You are getting hungry. To get food use `s!craft wooden hoe` to craft a hoe and `s!farm` to get food. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food')
  if(inventory.tools[pickaxe].durability < 1) return message.channel.send(`You cannot use this pickaxe anymore as it is broken, please use \`s!repair ${pickaxe}\` to repair it`)
  inventory.hunger-= 0.25
  inventory.lastactivity = Date.now()
  let mines = client.items.Materials
  let p = client.tools.Tools[pickaxe]
  let result = {}
  let m = `**${message.author.username} mined with a ${p.emote} and found`
  let drops = p.drops;
  if(inventory.dimension !== 'Overworld'){
    drops = p[inventory.dimension];
  }

  if(!drops) return message.channel.send(`Cannot mine with this pickaxe in the ${inventory.dimension}`)
  for(const mat in drops) {
    if(drops[mat][2] && Math.random() > drops[mat][2]) continue;
    result[mat] = Math.floor(Math.random() * drops[mat][1]) + drops[mat][0]
    inventory.materials[mat] ? inventory.materials[mat] += result[mat] : inventory.materials[mat] = result[mat]
  }

  inventory.tools[pickaxe].durability--
  for(const r in result) {
    let emote = mines[r].emote
    m += `\n ${emote} ${r} x${result[r]}`
  }
  m += `**`
  // console.log(inventory)
  await db.set(`inventory_${message.author.id}`, inventory)
  let embed = client.embed(message)
    .setTitle('Mine')
    .setDescription(m)

  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  cooldown: 5000
};

exports.help = {
  name: "mine",
  description: "Mine for materials and diamonds!",
  group: 'economy',
  usage: "mine"
};