const db = require('quick.db');
const discord = require('discord.js');

module.exports.run = async (client, message, args) => {  
  let amount = args[0];
  let balance = await db.fetch(`balance_${message.author.id}`)
  if(args.join('').toLowerCase() == 'all') amount = balance;
  amount = parseInt(amount);
  if(!amount || amount < 0) return message.channel.send('Please specify an amount to deposit!');
  if(amount > balance) return message.channel.send('You dont have enough money');
  await db.add(`bank_${message.author.id}`, amount);
  await db.subtract(`balance_${message.author.id}`, amount);
      let embed = new discord.MessageEmbed()
      .setTitle('Deposit')
      .setDescription('**:dollar: ' + message.author.username + ' has deposited ' + amount + ' to the bank**')
      .setColor('GREEN')
      .setFooter(message.author.username, message.author.displayAvatarURL())
     message.channel.send(embed);
}

exports.conf = {
  aliases: ['dep'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'deposit',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}