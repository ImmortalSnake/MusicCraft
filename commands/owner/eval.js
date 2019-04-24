const db = require('quick.db');
const sort = require('array-sort');
const discord = require('discord.js');
const ms = require('ms');
const pastebin = require('pastebin-js');
const paste = new pastebin(process.env.pastekey)
const request = require('request')

module.exports.run = async (client, message, args) => {
  if (message.author.id !== client.owner) return message.reply ('you are not allowed to use this command')
  if (!args) return message.channel.send(`Incorrect usage. Please use Java Script.`) 
  let embed = client.embed(message, { color: 'BLACK', title: '**Evaluation**' })
  try {
    let codein = args.join(" ");
    let code = eval(codein);
    if (typeof code !== 'string')
    code = require('util').inspect(code, { depth: 0 });
    if(code.includes(client.token)) code = code.replace(client.token, '--TOKEN--')
    if(code.length > 1024) {
      const data = await paste.createPaste(code);
      console.log(data)
      embed.setURL(data)
      .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
      .addField(':outbox_tray: Output', `\`\`\`js\n${code.slice(0, 1000)}\n\`\`\``)
      .setDescription('**Output was too long, uploaded to pastebin!**')
      return message.channel.send(embed)
    } else {
      embed.addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
      .addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
      return message.channel.send(embed);
    }
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
  usage: 'eval [code]',
  group: 'owner'
}