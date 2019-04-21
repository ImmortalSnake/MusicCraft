const discord = require('discord.js')

exports.run = (client, message, args) => {
    let embed = new discord.MessageEmbed()
    .setColor('#206694')
  if(args[0]) {
    const t = args[0].toLowerCase()
    const myCommands = message.guild ? client.commands : client.commands.filter(cmd => cmd.conf.guildOnly !== true)
    const groups = client.groups
    let command = myCommands.get(t)
    let group = groups.get(t)
    //= group.map(c => '\n\n**s!' + c.help.name + '**\n' + c.help.description)
    if(group) {
      let curpage = 1

      message.channel.send(genPage(group, embed, t, curpage))
      .then(async mess => {
        await mess.react('⬅')
        await mess.react('➡')
        
        const collector = mess.createReactionCollector((reaction, u) => u.id === message.author.id, { time: 180000 })
        collector.on('collect', r => {
          if(r.emoji.name === '⬅') {
            curpage --;
            mess.edit(genPage(group, embed, t, curpage));
          } else if (r.emoji.name === '➡') {
            curpage ++;
            mess.edit(genPage(group, embed, t, curpage));
          }
        })
        collector.on('end', async r => await mess.reactions.removeAll())
      })
    } else if(command) {
      embed.setTitle(command.help.name.toProperCase())
      .setDescription(`
**Group** ${command.help.group.toProperCase()}

**Description**
${command.help.description}

**Usage**
${command.help.usage}
${command.conf.aliases[0] ? '\n**Aliases**\n`' + command.conf.aliases.join(", ") + '`' : ''}
${command.conf.examples ? '\n**Examples**\n`' + command.conf.examples.join('\n') + '`' : ''}
`)
      return message.channel.send(embed);
    }
  }  else {
    embed.setDescription(`
**Commands List ${client.commands.size}**

The prefix for ${message.guild ? message.guild.name : client.user.username} is \`${message.guild ? message.guild.prefix : client.prefix}\`

Use \`s!help [command]\` to view detailed information about the command

Use \`s!help [group]\` to view all the commands in the group

\`s!help fun\` to view all fun commands
\`s!help economy\` to view all economy commands
\`s!help music\` to view all music commands
\`s!help general\` to view all basic commands

Join the support server for further help!

Documentation coming soon!`)
    return message.channel.send(embed)
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  group: "general",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};

function genPage(group, embed, t, curpage) {
  let m = '';
  let pages = Math.ceil(group.size / 10)
  let count = 0
  group.forEach(c => {
    if(count < curpage * 10 && count >= (curpage - 1) * 10) {
      m += `\n\n**${count+1}] s!${c.help.name}**\n${c.help.description}`
    }
     count ++;
  })
  embed.setTitle(t.toProperCase())
      .setDescription(`
${group.size} commands in ${t.toProperCase()}

Use \`s!help [command]\` to view detailed information about a command${m}`)
      .setFooter(`Page ${curpage}/${pages}`)
  return embed
}