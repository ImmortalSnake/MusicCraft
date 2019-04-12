const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  let op = parseInt(args.split(' ')[0]);
  let np = parseInt(args.split(' ').slice(1).join(''));
  if(!op) return message.client.functions.formatError(this, message);
  if(!np) np = 2;
  if (!message.member.voice.channel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
      if (!guildq) guildq = message.client.utils.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
      if(op < 2 || (op - 1) > guildq.queue.length) return message.reply('Position cannot be longer than the queue or below 2');
      if(np < 2 || (np - 1) > guildq.queue.length) return message.reply('Position cannot be longer than the queue or below 2');
      global.guilds[message.guild.id].queue = arraymove(guildq.queue, op - 1, np - 1)
			return message.channel.send('▶ Removed the music for you!');
    }

exports.conf = {
  aliases: ['q'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'move',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'move [command]'
}

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  console.log(arr)
  return arr;
}