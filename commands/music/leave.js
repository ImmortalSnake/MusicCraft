const commando = require('discord.js-commando');

class LeaveChannelCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            group: 'music',
            memberName: 'leave',
            description: 'leaves the voice channel xD',
            guildOnly: true,
        });
    }

    async run(message, args) {
   if(message.guild.voiceConnection) {
            global.guilds[message.guild.id] = message.client.utils.defaultQueue
            message.guild.voiceConnection.disconnect();
            message.channel.send('Left the voice channel');
        }
        else {
            message.channel.send('I am not in any voice channel..');
        }
    }
}

module.exports = LeaveChannelCommand;
