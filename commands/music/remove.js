module.exports.run = async (client, message, args) => {
  if(!parseInt(args)) return client.formatError(this, message);
  let check = await client.checkMusic(message, { vc: true, playing: true, djRole: true })
  if(check) return message.channel.send(check)
  let guildq = global.guilds[message.guild.id]

  if(!guildq.queue[args - 1]) return message.reply('Could not find a music in that id');
  guildq.queue.splice(0, args - 1);
  return message.channel.send('▶ Removed the music for you!');
}


exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'remove',
  description: 'Removes a song from the queue',
  group: 'music',
  usage: 'remove [position number in queue]'
}