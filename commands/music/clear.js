module.exports.run = async (client, message) => {
  let guildq = global.guilds[message.guild.id];
  if(!guildq) guildq = client.defaultQueue;
  let check = await client.checkMusic(message, { vc: true, djRole: true, playing: true });
  if(check) return message.channel.send(check);
  guildq.queue = guildq.queue.slice(0, 1);
  message.channel.send('The queue has been cleared by ' + message.author);
}

exports.conf = {
  aliases: ['cq'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'clear',
  description: 'Clears the queue of the server',
  group: 'music',
  usage: 'clear'
};

