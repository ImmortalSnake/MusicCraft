const db = require('quick.db');
const sort = require('array-sort');
const discord = require('discord.js');
const ms = require('ms')

module.exports.run = async (client, message, args) => {
  if (message.author.id !== client.owner) return message.reply ('you are not allowed to use this command')
  if (!args) return message.channel.send(`Incorrect usage. Please use Java Script.`) 
  try {
    let codein = args.join(" ");
    let code = eval(codein);
    if (typeof code !== 'string')
      code = require('util').inspect(code, { depth: 0 });
    message.channel.send(new client.Discord.MessageEmbed()
      .setAuthor('Evaluation')
      .setColor('BLACK')
      .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
      .addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
    );
    } catch(e) {
      message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
};


exports.conf = {
  aliases: ['evaluate'],
};

// Name is the only necessary one.
exports.help = {
  name: 'eval',
  description: 'Evaluates a JS code.',
  usage: 'eval',
  group: 'owner'
}