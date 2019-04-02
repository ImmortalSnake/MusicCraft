const db = require('quick.db');
const Discord = require('discord.js');
const ms = require('ms');

module.exports.run = async (client, message, args) => {

      const ptimer = await db.fetch(`timers_${message.author.id}_daily`);
      if(ptimer + client.utils.dailyTimer > Date.now()) {
        const tleft = ptimer + client.utils.dailyTimer - Date.now();
        return message.reply('You can get more coins in ' + ms(tleft, { long: true }));
      }
      let amount = client.utils.daily;
      let embed = new Discord.MessageEmbed()
      let streak = await db.fetch(`timers_${message.author.id}_streak`);
      if(!streak) streak =  await db.set(`timers_${message.author.id}_streak`, 1);
      if(streak && streak >= 5) {
        embed.setTitle('Daily **[STREAK]**');
        amount = client.utils.dailystreak;
        await db.set(`timers_${message.author.id}_streak`, 1);
      }
        else{
        embed.setTitle(`Daily [${streak}]`);
        await db.add(`timers_${message.author.id}_streak`, 1);
        }

      await db.add(`balance_${message.author.id}`, amount);
      embed
      .setDescription('**:dollar: ' + message.author.username + ' has recieved ' + amount + ' coins**')
      .setColor('GREEN')
      .setFooter(message.author.username, message.author.displayAvatarURL())
      message.channel.send(embed);
      await db.set(`timers_${message.author.id}_daily`, Date.now());
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'daily',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}
