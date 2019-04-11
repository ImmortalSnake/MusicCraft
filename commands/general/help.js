const discord = require('discord.js')

exports.run = (client, message, args) => {
  // If no specific command is called, show all filtered commands.
  /*if (!args[0]) {
    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const myCommands = message.guild ? client.commands : client.commands.filter(cmd => cmd.conf.guildOnly !== true)

    // Here we have to get the command names only, and we use that array to get the longest name.
    // This make the help commands "aligned" in the output.
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `= Command List =\n\n[Use ${message.guild.prefix}help <commandname> for details]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.group > c.help.group ? 1 :  p.help.name > c.help.name && p.help.group === c.help.group ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.group.toProperCase();
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${message.guild.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    message.channel.send(output, {code: "asciidoc", split: { char: "\u200b" }});
  } else {
    // Show individual command's help.
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(", ")}\n= ${command.help.name} =`, {code:"asciidoc"});
    }
  }*/
  if(args[0]) {
    const t = args[0].toLowerCase()
    const myCommands = message.guild ? client.commands : client.commands.filter(cmd => cmd.conf.guildOnly !== true)
    const groups = client.groups
    let command = myCommands.get(t)
    let group = groups.get(t)
    if(group) {
      let m = group.map(c => c.help.name)
      message.channel.send(m)
    } else if(command) {
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(", ")}\n= ${command.help.name} =`, {code:"asciidoc"});
    }
  } else {
    let embed = new discord.MessageEmbed()
    .setColor('#206694')
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
