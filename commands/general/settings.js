const db = require('quick.db');

exports.run = async (client, message, args) => {
	let settings = db.fetch(`settings_${message.guild.id}`);
	if(!settings) settings = db.set(`settings_${message.guild.id}`, client.defSettings);
	let prefix = settings.prefix;
	if(args[0]) {
		switch(args[0].toLowerCase()) {
		case 'prefix': {
			if(!args[1]) return message.channel.send(genEmbed(client, message, settings, 'prefix'));
			if(args[1].length > 5) return message.channel.send('The prefix cannot be more than 5 characters long');
			settings.prefix = args[1];
			await db.set(`settings_${message.guild.id}`, settings);
			return message.channel.send(`The prefix has successfuly been set to **${args[1]}**`);
		}
		case 'defvolume': {
			if(!args[1]) return message.channel.send(genEmbed(client, message, settings, 'defVolume'));
			let vol = parseInt(args[1]);
			if(!vol) return message.channel.send('Please enter a valid number');
			if(vol > 25 || vol <= 0) return message.channel.send('Volume cannot be more than 50 and cannot be less than 1');
			settings.defVolume = vol;
			await db.set(`settings_${message.guild.id}`, settings);
			return message.channel.send(`The default volume has successfuly been set to **${vol}**`);
		}
		case 'djrole': {
			if(!args[1]) return message.channel.send(genEmbed(client, message, settings, 'DJRole'));
			let role = message.mentions.roles.first() || message.guild.roles.find(r => r.name === args[1]);
			if(!role) return message.channel.send('Could not find the specified role. Please mention the role or provide the role name with correct spelling and capitalization');
			settings.djRole = role.id;
			await db.set(`settings_${message.guild.id}`, settings);
			return message.channel.send(`The DJ Role has successfuly been set to **${role.name}**`);
		}
		case 'announcesongs': {
			if(!args[1]) return message.channel.send(genEmbed(client, message, settings, 'announceSongs'));
			let val = args[1].toLowerCase();
			if(val !== 'on' && val !== 'off') return message.channel.send('Invalid Option, use `on` or `off`');
			settings.announceSongs = val;
			await db.set(`settings_${message.guild.id}`, settings);
			return message.channel.send(`Announce Songs has successfuly been toggled to **${val}**`);
		}
		case 'musicchannel': {
			if(!args[1]) return message.channel.send(genEmbed(client, message, settings, 'musicChannel'));
			let chan = message.mentions.channels.first();
			if(!chan) return message.channel.send('Could not find the specified channel. Please use `#channel`. Also make sure that i have permissions to view the channel');
			if(chan.type !== 'text') return message.channel.send('Please mention a `Text Channel`');
			settings.musicChannel = chan.id;
			await db.set(`settings_${message.guild.id}`, settings);
			return message.channel.send(`The Music Channel has successfuly been set to **${chan}**`);
		}
		}
	}
	let embed = client.embed(message, {title: '**SETTINGS**'})
		.setDescription(`Use \`${prefix}settings [option]\` to view details of an option`)
		.addField('Prefix', `\`${prefix}settings prefix\``, true)
		.addField('DJRole', `\`${prefix}settings djrole\``, true)
		.addField('Announce Songs', `\`${prefix}settings announcesongs\``, true)
		.addField('Default Volume', `\`${prefix}settings defvolume\``, true)
		.addField('Music Channel', `\`${prefix}settings musicchannel\``, true);
	return message.channel.send(embed);
};

function genEmbed(client, message, settings, type) {
	let info = client.settings[type];
	let mbed = client.embed(message);
	let value = settings[info.value] || 'None';
	if (info.type === 'channel' && value !== 'None') value = message.guild.channels.get(value);
	if (info.type === 'role' && value !== 'None') value = message.guild.roles.get(value);
	mbed.setTitle(`Settings - **${info.name}**`)
		.setDescription(info.description)
		.addField('Current Setting', `\`${value}\``)
		.addField('Usage', `\`${settings.prefix}settings ${info.usage}\``);
	return mbed;
}

exports.conf = {
	aliases: ['setting'],
	enabled: true,
	guildOnly: true,
	perms: ['ADMINISTRATOR']
};

// Name is the only necessary one.
exports.help = {
	name: 'settings',
	description: 'Shows and changes the settings for the bot in the guild!',
	group: 'general',
	usage: 'settings [option] [value]'
};