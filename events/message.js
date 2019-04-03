let playing = {}

exports.run = async (client, message) => {
    /* Statement below disables bot-to-bot commands by returning if the message author is a bot */
  if (message.author.bot) return;
    /* First step of checking if it's a command is checking if the message begins with the prefix we have set */
  let prefix = client.prefix;
  if(message.guild){
    if(!message.guild.prefix) {
    message.guild.prefix = 's!'
    }
    prefix = message.guild.prefix;
  }
  if (!message.content.startsWith(prefix)) return;
  var args = message.content.split(" ").slice(1);
  var cmd = message.content.split(' ')[0].slice(prefix.length).toLowerCase();
  var command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if(!command) return;
  if(command.conf.guildOnly && !message.guild) return;
  if(command.conf.enabled === false && !client.admins.includes(message.author.id)) return message.channel.send(`\`${command.help.name}\` is disabled right now. Try again later`)
  if(message.guild && command.conf.perms) {
  for(let i = 0; i < command.conf.perms.length; i++) {
  if(!message.member.hasPermission(command.conf.perms[i])) return message.channel.send('You do not have the required permission')
  }
  }
  if (command)command.run(client, message, args)
}