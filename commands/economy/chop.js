const db = require('quick.db');
const discord = require('discord.js')
const playing = new Set();

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have an axe .Use the `s!start` command to get an axe');
    if(inventory.hunger <= 5) return message.channel.send('You are too hungry. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food or wait until your hunger reaches back to 100')
  
  inventory = await client.checkInventory(message.author);
  if(Date.now() - inventory.lastactivity >= client.utils.rhunger && inventory.hunger < 75) inventory.hunger += 25
  if(inventory.hunger %2 == 0 && inventory.hunger <= 25) await message.channel.send('You are getting hungry. To get food use `s!craft wooden hoe` to craft a hoe and `s!farm` to get food. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food')
  
  inventory.hunger -= 0.25
  let eaxe = inventory.equipped.axe;
  let axe = client.tools.Tools[eaxe]
  let drops = Math.floor(Math.random() * axe.drops[1]) + axe.drops[0] 
  let wood = client.items.Materials.Wood;
  inventory.materials.Wood = inventory.materials.Wood + drops
  await client.checkInventory(message.author)
  let apple = false;
  let m = ''
  let rand = Math.random()
  if( rand > .9) apple = true
  if(apple){ 
    inventory.food['Apple'] ? inventory.food['Apple']++ : inventory.food['Apple'] = 1
    m = `\n You found an Apple ${client.items.food['Apple'].emote}`
  }
  inventory.lastactivity = Date.now()
  await db.set(`inventory_${message.author.id}`, inventory);
  let embed = new discord.MessageEmbed()
  .setTitle('Chop')
  .setColor('GREEN')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .setDescription(`**${message.author.username} chopped wood with ${axe.emote}
You got ${drops} ${wood.emote}.${m}**`)
  message.channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: [],
    botPerms: [],
    cooldown: 5000
};
  
exports.help = {
    name: "chop",
    description: "Fish and try to turn your credits into a fortune!",
    group: 'economy',
    usage: "",
    extendedHelp: "Spend 10 credits to fish and catch yourself a fortune!"
};