const db = require('quick.db');
const Discord = require('discord.js');
const ms = require('ms');
const sort = require('array-sort');

module.exports.run = async (client, message, args) => {
    //let money = await client.dbSort(`balance`);
  let total = db.all().filter(b=>b.ID.startsWith('balance'))
  for(let i = 0; i< total.length; i++) {
    let bank = await db.fetch(`bank_${total[i].ID.split('_')[1]}`)
    total[i].data = total[i].data + bank;
  }
  let money = sort(total, 'data', { reverse: true})
  let content = "";
  let pos
    for(let i = 0; i < money.length; i++) {
      if(i < 20) {
        let user = client.users.get(money[i].ID.split('_')[1]);
        if(!user) {
          db.delete(`balance_${money[i].ID.split('_')[1]}`)
          db.delete(`bank_${money[i].ID.split('_')[1]}`)
        }
        else {
          if(user.id === message.author.id) pos = i+1
          content += `${i+1}. ${user.tag} ~ ${money[i].data}\n`;
        }
      }
    }
  content += `........\nYour position ${pos}`
  const embed = new Discord.MessageEmbed()
      .setAuthor(`${client.user.username} - LeaderBoard`, message.guild.iconURL)
      .setDescription(content)
      .setColor('GREEN');
  message.channel.send(embed);
}

exports.conf = {
  aliases: ['lb'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'leaderboard',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}
