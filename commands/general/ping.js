const commando = require('discord.js-commando');
const { oneLine } = require('common-tags');
const discord = require('discord.js');

module.exports = class SettingsCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      group: 'general',
      memberName: 'ping',
      description: 'Shows the current latency of the bot',
      guarded: true,
    });
  }
  async run(message, args) {
    message.channel.send('Pinging..').then(m => { 
    m.edit(`🏓 API: \`${Math.round(message.client.ping)}\`    Latency: \`${Date.now() - m.createdTimestamp}\``)
    })
  }
}
