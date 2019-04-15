
exports.run = async (client, message, args) => {
  let amount = parseInt(args[0])
  if(!amount) return message.channel.send('Please enter an amount of messages to delete');
  let msgs = await message.channel.messages.fetch()
  let msg = msgs.filter(m => m.author.id === client.user.id)
  msg = Array.from(msg.keys()).slice(0, amount)
  console.log(msg)
  await message.channel.bulkDelete(msg)
  
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'clean',
  description: 'Evaluates a JS code.',
  group: 'general',
  usage: 'coin [command]'
}