const cooldown = {};
const tips = [
	'Use the `s!trade` command to trade with other players!',
	''
];

const ms = require('ms');

exports.run = async (client, message) => {
	if(message.author.id === client.user.id && message.content.includes(client.token)) return message.delete();
	if (message.author.bot) return;

	let prefix = client.prefix;
	const options = { tips: tips };

	if(message.guild) {
		const settings = await client.guilddb.findOne({ id: message.guild.id });
		options.settings = settings;
		prefix = settings.prefix;
	}

	options.prefix = prefix;
	let args, cmd, isMentioned = false;

	if (message.content.startsWith(prefix)) {
		args = message.content.split(' ').slice(1);
		cmd = message.content.split(' ')[0].slice(prefix.length).toLowerCase();
	} else if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {
		args = message.content.split(' ').slice(2);
		cmd = message.content.split(' ')[1] ? message.content.split(' ')[1].toLowerCase() : '';
		isMentioned = true;
	}

	const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

	if(!command && !isMentioned) return;
	else if(!command && isMentioned) return; // chat bot?
	if(command.conf.guildOnly && !message.guild) return;

	const permLevel = client.perms.level(client, message.member ? message.member : message.guild);

	if(command.conf.enabled === false && permLevel < 9) return message.channel.send(`\`${command.help.name}\` is disabled right now. Try again later`);

	if(message.guild && command.conf.perms) {
		for(let i = 0; i < command.conf.perms.length; i++) {
			if(!message.member.hasPermission(command.conf.perms[i])) return message.channel.send(`You do not have the required permission. Permission Required: ${command.conf.perms[i]}`);
		}
	}

	if(command.conf.permLevel && command.conf.permLevel > permLevel) return message.channel.send(client.perms.get(command.conf.permLevel));

	if(cooldown[`${message.author.id}_${command.help.name}`]) {
		message.channel.send(`Woah there! you gotta wait ${ms(Math.abs(Date.now() - cooldown[`${message.author.id}_${command.help.name}`] - command.conf.cooldown), { long:true })} before you use this command`);
		if(Math.abs(Date.now() - cooldown[`${message.author.id}_${command.help.name}`] - command.conf.cooldown) > 10) {
      // give em some crates or somethin
    }
   	return;
	}

	options.name = command.help.name;

	if(command.conf.cooldown) {
		cooldown[`${message.author.id}_${command.help.name}`] = Date.now();

		setTimeout(() => {
			delete cooldown[`${message.author.id}_${command.help.name}`];
		}, command.conf.cooldown);
	}

	try {
		await command.run(client, message, args, options);
	} catch(err) {
		console.log(err);
	}
};