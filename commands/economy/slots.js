const db = require('quick.db');
const discord = require('discord.js');
const slots = ['🍇', '🍒', '🍋'];
const ms = require('ms');

module.exports.run = async (client, message, args) => { 
    let bet = parseInt(args[0]);
    if(!bet) return message.channel.send('Specify the amount you want to bet')
    let balance = await db.fetch(`balance_${message.author.id}`)
    if(bet > balance) return message.channel.send('You dont have enough money')
    const slotOne = slots[Math.floor(Math.random() * slots.length)];
		const slotTwo = slots[Math.floor(Math.random() * slots.length)];
		const slotThree = slots[Math.floor(Math.random() * slots.length)];
    let embed = new discord.MessageEmbed()
    .setFooter(message.author.username, message.author.displayAvatarURL());
		if (slotOne === slotTwo && slotOne === slotThree) {
      await db.add(`balance_${message.author.id}`, bet * 10)
			embed.setDescription(`
				${slotOne}|${slotTwo}|${slotThree}
				You won ${bet * 10}!
			`)
      .setColor('GREEN');
      message.channel.send(embed);
		}
  else {
    await db.subtract(`balance_${message.author.id}`, bet)
		embed.setDescription(`
			${slotOne}|${slotTwo}|${slotThree}
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