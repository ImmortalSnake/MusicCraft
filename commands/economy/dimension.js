
exports.run = async (client, message, args) => {
  
}

exports.conf = {
  aliases: ['dim'],
  enabled: false,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'dimension',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}