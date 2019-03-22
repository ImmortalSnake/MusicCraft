const commando = require('discord.js-commando');
const discord = require('discord.js');
const request = require("request");
// require all yer stuff here

module.exports = class PingCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            group: 'owner',
            memberName: 'eval',
            ownerOnly: true,
            description: 'Executes JavaScript Code',
            format: '<code>'
        });
    }

async run(message, args) {
const bot = message.client;
if (message.author.id !== bot.utils.owner) return message.reply ('you are not a bot developer.')
if (!args) return message.channel.send(`Incorrect usage. Please use Java Script.`)
try {
  let codein = args;
  let code = eval(codein);
  if (typeof code !== 'string')
  code = require('util').inspect(code, { depth: 0 });
  let embed = new discord.RichEmbed()
    .setAuthor('Evaluation')
    .setColor('BLACK')
    .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
    .addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
  message.channel.send(embed)
  } catch(e) {
    message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
  }
}
}
