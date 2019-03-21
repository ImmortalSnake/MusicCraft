const commando = require('discord.js-commando');
const discord = require('discord.js');

class SuggestCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'help',
      group: 'general',
      memberName: 'help',
      examples: ['help', 'help prefix'],
      format: 'help [command]',
      description: 'Shows you a list of commands or detailed information about a command',
    });
  }

  async run(message, args) {
const bot = message.client
if(!args) {
  let embed = new discord.RichEmbed()
  .setTitle(`Commands List (${bot.registry.commands.size})`)
  .setColor('GREEN')
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .setDescription(`The prefix for ${message.guild.name} is \`?\`.
\nA list of SnakeBot's Commands can be found here \n[Commands list](https://snakebot-disc.glitch.me/commands)
\nJoin the support server for more info\n[Support Server](https://discord.gg/b8S3HAw).
\nUse \`${message.guild.commandPrefix}help [command]\` to view detailed information about a specific command.`)
  message.channel.send(embed);
}
else if(bot.registry.commands.some(c=> c.name == args.toLowerCase() || c.aliases.includes(args.toLowerCase()))) {
  let cmd = bot.registry.commands.find(c=> c.name == args.toLowerCase() || c.aliases.includes(args.toLowerCase()))
  let embed = new discord.RichEmbed()
  .setTitle(`**${cmd.name}**`)
  .setColor('GREEN')
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .setDescription(`
\n**Description:**\n\`${cmd.description}\`
\n**Group:** ${cmd.group.name} ${(cmd.guildOnly) ? `**\`[Server Only]\`**` : ''}
\n**Usage:**\n ${cmd.usage(cmd.format, message.guild.commandPrefix)}
\n${((cmd.aliases && cmd.aliases[0]) ? `**Aliases:**\n \`${cmd.aliases.join(', ')}\`` : '')}
\n${((cmd.details) ? `**Details:**\n \`${cmd.details}\`` : '')}
\n${((cmd.examples) ? `**Examples:**\n \`${cmd.examples.join('\n')}\`` : '')}`);
  message.channel.send(embed);
}
}
};
module.exports = SuggestCommand;
