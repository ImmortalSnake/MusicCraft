const db = require('quick.db');
const discord = require('discord.js');

module.exports.run = async (client, message, args) => {  
  let amount = args[0];
  let bank = await db.fetch(`bank_${message.author.id}`)
  if(args.join('').toLowerCase() == 'all') amount = bank;
  amount = parseInt(amount);
  if(!amount || amount < 0) return message.channel.send('Please specify an amount to withdraw!');
  if(amount > bank) return message.channel.send('You dont have enough money in the bank');
  await db.add(`balance_${message.author.id}`, amount);
  await db.subtract(`bank_${message.author.id}`, amount);
      let embed = new discord.MessageEmbed()
      .setTitle('Withdraw')
      .setDescription('**:dollar: ' + message.author.username + ' withdrew ' + amount + ' from the bank**')
      .setColor('GREEN')
      .setFooter(message.author.username, message.author.displayAvatarURL())
     message.channel.send(embed);
}

exports.conf = {
  aliases: ['with'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'withdraw',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}