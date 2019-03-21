const commando = require('discord.js-commando');
const discord = require('discord.js');

class VolumeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'removedupes',
            group: 'music',
            aliases: ['rd'],
            memberName: 'removedupes',
            description: 'Clears the music queue for ya',
            guildOnly: true,
        });
    }

    async run(message, args) {
  if (!message.member.voiceChannel) return message.reply('You are not in a voice channel!');
    let guildq = global.guilds[message.guild.id];
    if (!guildq) guildq = message.client.utils.defaultQueue;
		if (!guildq.isPlaying) return message.reply('There is nothing playing.');
      let old = guildq.queue.length
      global.guilds[message.guild.id].queue = rd(guildq.queue);
      let nq = global.guilds[message.guild.id].queue.length
      message.reply(`The queue dupes has been cleared by ${message.author}. \`${old-nq}\` songs removed `);
    }
}

module.exports = VolumeCommand;

function rd(q) {
  let nq = []
  q.forEach(e => {if(!nq.includes(e)) nq.push(e);})
  return nq;
}
