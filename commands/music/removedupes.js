module.exports.run = async (client, message) => {
  let check = await client.checkMusic(message, { vc: true, playing: true, djRole: true });
  if(check) return message.channel.send(check);
  let guildq = global.guilds[message.guild.id];
  let old = guildq.queue.length;
  guildq.queue = rd(guildq.queue);
  let nq = guildq.queue.length;
  message.reply(`The queue dupes has been cleared by ${message.author}. \`${old-nq}\` songs removed `);
};


exports.conf = {
  aliases: ['rd'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'removedupes',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'removedupes [command]'
};

function rd(q) {
  let nq = [];
  q.forEach(e => {if(!nq.includes(e)) nq.push(e);});
  return nq;
};