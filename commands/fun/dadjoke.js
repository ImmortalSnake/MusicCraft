const fetch = require('node-superfetch');
const discord = require('discord.js')
module.exports.run = async (client, message, args) => {
const url = `https://icanhazdadjoke.com/`;
  fetch.get(url, {
        headers: {Accept: "application/json"},
    }).then(async res => {
    res = JSON.parse(res.text)
    let embed = new discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL)
    .setTitle('Dad Joke')
    .setDescription(res.joke)
    .setColor('GREEN')
    .setTimestamp()
    
    message.channel.send(embed)
  })
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'dadjoke',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'youtube [command]'
}
