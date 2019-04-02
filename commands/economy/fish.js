const db = require('quick.db');
const fish = require('../../assets/items');
const discord = require('discord.js')

exports.run = async (client, message, args) => {
  let balance = await db.fetch(`balance_${message.author.id}`)
  if(balance < 25) return message.channel.send('You do not have enough money to fish')
  await db.subtract(`balance_${message.author.id}`, 25)
    let random = Math.random();
    let result;
    const fishes = ["trash", "fish", "crab", "shark"];
      if (random < .5) result = 0;
      else if (random < .75) result = 1; 
      else if (random < .9) result = 2;
      else result = 3;
    
  let kind = fishes[result];
  let m = (kind === 'trash') ? 'You lost 25$' : `You sold it for ${fish.Fish[kind].price}$`
  await db.add(`balance_${message.author.id}`, fish.Fish[kind].price) 
  let embed = new discord.MessageEmbed()
  .setTitle(':fishing_pole_and_fish: Fish')
  .setColor('GREEN')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .setDescription(`**${message.author.username} paid 25$ and caught a ${kind} ${fish.Fish[kind].emote}.\n${m}**`)
  
  message.channel.send(embed);
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
    name: "fish",
    description: "Fish and try to turn your credits into a fortune!",
    group: 'economy',
    usage: "",
    extendedHelp: "Spend 10 credits to fish and catch yourself a fortune!"
};