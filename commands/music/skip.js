
module.exports.run = async (client, message, args) => {
 if (!message.member.voice.channel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
   if (!guildq) guildq = client.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
        if (guildq.queue[0].skippers.indexOf(message.author.id) == -1) {
            guildq.queue[0].skippers.push(message.author.id);
            if ((Math.ceil((guildq.voiceChannel.members.size - 1) / 2) - guildq.queue[0].skippers.length) === 0) {
                guildq.dispatcher.end();
                return message.reply('✅ Your skip has been acknowledged. Skipping now!');
            }
          else {
            message.reply(' your skip has been acknowledged. You need **' + (Math.ceil((guildq.voiceChannel.members.size - 1) / 2) - guildq.queue[0].skippers.length) + '**  more skip votes!');
          }
        }
      else {
            message.reply(' you already voted to skip!');
        }
}

exports.conf = {
  aliases: ['s'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'skip',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'skip [command]'
}


