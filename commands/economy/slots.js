const db = require('quick.db');
const discord = require('discord.js');
const slots = ['🍇', '🍒', '🍋'];
const ms = require('ms');

module.exports.run = async (client, message, args) => { 
    let bet = parseInt(args[0]);
    if(!bet) return message.channel.send('Specify the amount you want to bet')
    let balance = await db.fetch(`balance_${message.author.id}`)
    if(bet > balance) return message.channel.send('You dont have enough money')
    let result1 = (Math.floor(Math.random() * slots.length));
    let result2 = (Math.floor(Math.random() * slots.length));
    let result3 = (Math.floor(Math.random() * slots.length));

    let random1 =  result1 > 0 ? result1 - 1 : slots.length - 1
    let random2 =  result2 > 0 ? result2 - 1 : slots.length - 1
    let random3 =  result3 > slots ? result3 - 1 : slots.length - 1
    let random4 =  result1 < slots.length - 1 ? result1 + 1 : 0
    let random5 =  result2 < slots.length - 1 ? result2 + 1 : 0
    let random6 =  result3 < slots.length - 1 ? result3 + 1 : 0
    let m = `
${slots[random1]} ${slots[random2]} ${slots[random3]}
**----------------**
${slots[result1]} ${slots[result2]} ${slots[result3]} **<<<**
**----------------**
${slots[random4]} ${slots[random5]} ${slots[random6]}
`
    let embed = new discord.MessageEmbed()
    .setFooter(message.author.username, message.author.displayAvatarURL());
		if (result1 === result2 && result1 === result3) {
      await db.add(`balance_${message.author.id}`, bet * 10)
			embed.setDescription(`${m}
You won ${bet * 10}!
			`)
      .setColor('GREEN');
      message.channel.send(embed);
		}
  else {
    await db.subtract(`balance_${message.author.id}`, bet)
		embed.setDescription(`
			${m}
			You lost ${bet}, better luck next time!`)
      .setColor('RED');
    message.channel.send(embed);
  }
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true,
  cooldown: 10000
};

// Name is the only necessary one.
exports.help = {
  name: 'slots',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}