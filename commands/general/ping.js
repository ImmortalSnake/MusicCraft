const commando = require('discord.js-commando');
const { oneLine } = require('common-tags');
const discord = require('discord.js');

module.exports = class SettingsCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      aliases: ['setting'],
      group: 'moderation',
      memberName: 'settings',
      description: 'Sets or shows server settings.',
      guildOnly: true,
      guarded: true,
    });
  }
  async run(message, args) {

  }
}
