module.exports.run = async (client, message, args) => {
  let check = await client.checkMusic(message, { vc: true, playing: true, djRole: true});
  if(check) return message.channel.send(check);
  let guildq = global.guilds[message.guild.id];
  guildq.queue = shuffle(guildq.queue);
  message.channel.send('**Shuffled The Queue**');
};


function shuffle(brr) {
  let cp = brr[0];
  let arr = brr.slice(1);
  for (let i = arr.length; i; i--) {
    const j = Math.floor(Math.random() * i);
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
  arr.unshift(cp);
  return arr;
}

exports.conf = {
  aliases: ['shuff'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'shuffle',
  description: 'Shuffles the queue',
  group: 'music',
  usage: 'shuffle'
};
