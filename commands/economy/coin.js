const db = require('quick.db')
const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
        const chance = Math.floor(Math.random() * 2);
        const embed = new Discord.MessageEmbed();
        const heads = client.emojis.find(emoji => emoji.name === 'heads');
        const tails = client.emojis.find(emoji => emoji.name === 'tails');
        let choice = args.slice(0, 1).join('').toLowerCase() || 'heads';
        let bet = parseInt(args.slice(1).join('')) || 10;

        embed.setFooter(message.author.username, message.author.displayAvatarURL());
        let result = false;
        if(chance === 0) {
          embed.setTitle(`${heads} Your coin has landed on heads!`);
          if(choice === 'heads' || choice === 'head') {
            result = true;
          }
        }
        else {
        embed.setTitle(`${tails} Your coin has landed on tails!`);
        if(choice === 'tails' || choice === 'tail') {
          result = true;
        }
        }
      if(choice && choice === 'tails' || choice === 'tail' || choice === 'heads' || choice === 'head') {
      let coin = await db.fetch(`balance_${message.author.id}`);
        if(!coin) coin = await db.set(`balance_${message.author.id}`, client.utils.defaultBal);
      if(coin >= bet) {
      if(result === false) {
        embed.setDescription('You lost ' + bet + ' coins');
        embed.setColor('RED');
        await db.subtract(`balance_${message.author.id}`, bet);
      }
      else {
        embed.setDescription('You won ' + bet + ' coins');
        embed.setColor('GREEN');
        await db.add(`balance_${message.author.id}`, bet);
      }
      }
    else {
      embed.setDescription('You dont have enough coins');
    }
    }
      message.channel.send(embed);
}

exports.conf = {
  aliases: ['coinflip'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'coin',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}
