const db = require('quick.db');
const fish = require('../../assets/items');
const discord = require('discord.js')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a fishing rod .Use the `s!start` command to start playing');
  let r = inventory.equipped.rod;
  if(!r) return message.channel.send('You do not have a fishing rod. Use `s!craft fishing rod` to craft one')
  let rod = client.tools.Tools[r]
  let random = Math.random()
  let result = '';
  for(const drops in rod.drops) {
    if(Math.random() > rod.drops[drops]) result = drops;
  }
  if(result) inventory.food[result] ? inventory.food[result]++ : inventory.food[result] = 1
  else result = 'Nothing';
  let fish = client.items.Food[result] || { emote: ''}
  let embed = new discord.MessageEmbed()
  .setTitle(':fishing_pole_and_fish: Fish')
  .setColor('GREEN')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .setDescription(`**${message.author.username} tried to fish with a ${r} and found
${result} ${fish.emote}**`)
  
  await db.set(`inventory_${message.author.id}`, inventory)
  return message.channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: [],
    botPerms: [],
    cooldown: 30 * 60 * 1000
};
  
exports.help = {
    name: "fish",
    description: "Fish and try to turn your credits into a fortune!",
    group: 'economy',
    usage: "",
    extendedHelp: "Spend 10 credits to fish and catch yourself a fortune!"
};