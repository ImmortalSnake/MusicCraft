const db = require('quick.db');
const discord = require('discord.js')
const playing = new Set;

exports.run = async (client, message, args) => {
  let balance = await db.fetch(`balance_${message.author.id}`)
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a pickaxe .Use the `s!start` command to get a pickaxe')
  let pickaxe = inventory.equipped.pickaxe
  if(!pickaxe) return message.channel.send('You do not have a pickaxe. Chop some wood with `s!chop` and craft a pickaxe using `s!craft`')
    if (playing.has(`${message.author.id}`)) return message.channel.send(`You can mine only once in 5 seconds`);
playing.add(`${message.author.id}`);
  let mines = client.items.Materials
  let p = pickaxe = client.tools.Tools[pickaxe]
  let result = {}
  let m = `**${message.author.username} mined and found`
  for(const mat in p.drops) {
    if(p.drops[mat][2] && Math.random() > p.drops[mat][2]) continue;
        result[mat] = Math.floor(Math.random() * p.drops[mat][1]) + p.drops[mat][0]
    inventory.materials[mat] += result[mat];
  }
  for(const r in result) {
    let emote = client.items.Materials[r].emote
    m += `\n ${emote} ${r} x${result[r]}`
  }
  m += `**`
  await db.set(`inventory_${message.author.id}`, inventory)
  let embed = new discord.MessageEmbed()
  .setTitle(':fishing_pole_and_fish: Mine')
  .setColor('GREEN')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .setDescription(m)
  
  message.channel.send(embed);
  
  setTimeout(() => {
      playing.delete(`${message.author.id}`);
        }, 5000);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: [],
    botPerms: [],
    cooldown: 30
};
  
exports.help = {
    name: "mine",
    description: "Fish and try to turn your credits into a fortune!",
    group: 'economy',
    usage: "",
    extendedHelp: "Spend 10 credits to fish and catch yourself a fortune!"
};