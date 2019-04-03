const db = require('quick.db');
const discord = require('discord.js')
const playing = new Set();

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a hoe .Use the `s!start` command to get an hoe');
  let hoe = inventory.equipped.hoe
  if(!hoe) return message.channel.send('You do not have an hoe .Use the `s!start` command to get a hoe');
  if (playing.has(`${message.author.id}`)) return message.channel.send(`You can farm only once in 5 minutes`);
playing.add(`${message.author.id}`);
  await client.checkInventory(message.author)
  inventory.hunger -= 2
  let ehoe = client.tools.Tools[hoe]
  let drops = Math.floor(Math.random() * ehoe.drops[1]) + ehoe.drops[0]
  let rand = ['Potato', 'Carrot', 'Wheat'].random()
  let food = client.items.food[rand]
  inventory.food[rand] ? inventory.food[rand]+=drops : inventory.food[rand] = drops
  // inventory.materials.Wood = inventory.materials.Wood + drops
   await db.set(`inventory_${message.author.id}`, inventory);
  let embed = new discord.MessageEmbed()
  .setTitle(':fishing_pole_and_fish: Chop')
  .setColor('GREEN')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .setDescription(`**${message.author.username} farmed with ${ehoe.emote}.
You got ${drops} ${food.emote}.**`)
  message.channel.send(embed); 
  setTimeout(() => {
      playing.delete(`${message.author.id}`);
        }, 300 * 1000);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: [],
    botPerms: [],
    cooldown: 5
};
  
exports.help = {
    name: "farm",
    description: "Fish and try to turn your credits into a fortune!",
    group: 'economy',
    usage: "",
    extendedHelp: "Spend 10 credits to fish and catch yourself a fortune!"
};