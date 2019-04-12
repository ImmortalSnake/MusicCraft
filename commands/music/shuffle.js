const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
      let guildq = global.guilds[message.guild.id];
        if (!guildq) guildq = client.defaultQueue;
        if(guildq.queue.length == 0) return message.channel.send('no music queue right now..');
        global.guilds[message.guild.id].queue = shuffle(guildq.queue);
        message.channel.send('**Shuffled The Queue**')
    }


function shuffle(brr) {
let cp = brr[0]
let arr = brr.slice(1)
     for (let i = arr.length; i; i--) {
         const j = Math.floor(Math.random() * i);
         [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
     }
  arr.unshift(cp);
return arr
 }

exports.conf = {
  aliases: ['shuff'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'shuffle',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'shuffle [command]'
}
