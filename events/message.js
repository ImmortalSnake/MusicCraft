let cooldown = {}
const tips = [
  '',
  ''
]

const ms = require('ms')
exports.run = async (client, message) => {
  if (message.author.bot) return;
  let prefix = client.prefix;
  if(message.guild){
    if(!message.guild.prefix) {
    message.guild.prefix = client.prefix
    }
    prefix = message.guild.prefix;
  }
  let args, cmd, command;
  if (message.content.startsWith(prefix)) {
    args = message.content.split(" ").slice(1);
    cmd = message.content.split(' ')[0].slice(prefix.length).toLowerCase();
  } else if (message.content.startsWith(`<@${client.user.id}>`)) {
    args = message.content.split(" ").slice(2);
    cmd = message.content.split(' ')[1].toLowerCase();
  }
  command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if(!command) return;
  if(command.conf.guildOnly && !message.guild) return;
  if(command.conf.enabled === false && !client.admins.includes(message.author.id)) return message.channel.send(`\`${command.help.name}\` is disabled right now. Try again later`)
  
  if(message.guild && command.conf.perms) {
    for(let i = 0; i < command.conf.perms.length; i++) {
      if(!message.member.hasPermission(command.conf.perms[i])) return message.channel.send(`You do not have the required permission. Permission Required: ${command.conf.perms[i]}`)
    }
  }
  
  if(cooldown[`${message.author.id}_${command.help.name}`]) {
    message.channel.send(`Woah there! you gotta wait ${ms(Math.abs(Date.now() - cooldown[`${message.author.id}_${command.help.name}`] - command.conf.cooldown), {long:true})} before you use this command`)
    return
  }
    if(command.conf.cooldown) {
    cooldown[`${message.author.id}_${command.help.name}`] = Date.now()
      setTimeout(() => {
        delete cooldown[`${message.author.id}_${command.help.name}`]
      }, command.conf.cooldown)
  }
    try {
  command.run(client, message, args)
    } catch(err) {
      console.log(err)
    }
}