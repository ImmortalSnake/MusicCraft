const commando = require('discord.js-commando');
const discord = require('discord.js');

module.exports = class ShuffleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'shuffle',
            group: 'music',
            memberName: 'shuffle',
            description: 'Shuffles the music queue!',
            guildOnly: true,
        });
    }

    async run(message, args) {
      let guildq = global.guilds[message.guild.id];
      let bot = message.client;
        if (!guildq) guildq = message.client.utils.defaultQueue;
        if(guildq.queue.length == 0) return message.channel.send('no music queue right now..');
        global.guilds[message.guild.id].queue = shuffle(guildq.queue);
        message.channel.send('**Shuffled The Queue**')
    }
}

function shuffle(brr) {
let cp = brr[0]
let arr = brr.slice(1)
     for (let i = arr.length; i; i--) {
         const j = Math.floor(Math.random() * i);
         [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
     }
  arr.unshift(cp);
return arr
 }
