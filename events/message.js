const cooldown = {};
const ms = require('ms');

exports.run = async (client, message) => {
	if(message.author.id === client.user.id && message.content.includes(client.token)) return message.delete();
	if (message.author.bot) return;
	if(message.guild && (!message.guild.me.hasPermission('SEND_MESSAGES') || !message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES'))) return;
	let prefix = client.prefix;
	const options = { mc: client.mc };
	const mention = new RegExp(`^<@!?${client.user.id}>`);

	if(message.guild) {
		let settings = await client.guilddb.findOne({ id: message.guild.id });
		if(!settings) {
			const data = new client.guilddb({
				id: message.guild.id,
				prefix: client.prefix,
			});
			await data.save();
			console.log(`New guild added ${message.guild.name}`);
			settings = await client.guilddb.findOne({ id: message.guild.id });
		}
		options.settings = settings;
		prefix = settings.prefix;
	}

	options.prefix = prefix;
	let args, cmd, isMentioned = false;

	if (message.content.startsWith(prefix)) {
		args = message.content.split(' ').slice(1);
		cmd = message.content.split(' ')[0].slice(prefix.length).toLowerCase();
	} else if(mention.test(message.content)) {
		console.log('Mentioned!');
		args = message.content.split(' ').slice(2);
		cmd = message.content.split(' ')[1] ? message.content.split(' ')[1].toLowerCase() : '';
		isMentioned = true;
	}

	const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

	if(!command && !isMentioned) return;
	else if(!command && isMentioned && client.config.mentionPrefix) return; // chat bot?
	if(command.conf.guildOnly && !message.guild) return;

	const permLevel = client.perms.level(client, message.guild ? message.member : message.author, options.settings);

	if(command.conf.enabled === false && permLevel < 9) return message.channel.send(`\`${command.help.name}\` is disabled right now. Try again later`);

	if(message.guild && command.conf.perms && message.author.id !== client.owner) {
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
		return message.channel.send('Uh oh, an error has occurred. Please try again later');
	}
};