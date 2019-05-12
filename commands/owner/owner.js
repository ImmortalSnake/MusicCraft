const db = require('quick.db');
const discord = require('discord.js');
const fetch = require('node-superfetch');
const youtubedl = require('youtube-dl');
const url = 'https://icanhazdadjoke.com/';
const fs = require('fs');

module.exports.run = async (client, message, args) => {
	if(!client.admins.includes(message.author.id)) return message.reply ('you are not allowed to use this command');
	if(!args[0]) return message.channel.send('Correct format is `s!owner [option]`');
	const user = client.users.get(args[1]) || message.mentions.users.first();

	switch(args[0].toLowerCase()) {

	case 'inv': {

		if(!user) return message.channel.send('Could not find that user');
		const inventory = await client.inv.findOne({ id: user.id });
		if(!inventory) return message.channel.send('That user does not have a player');
		const embed = client.embed(message, { title: '**Inventory**' })
			.setFooter(user.username, user.displayAvatarURL())
			.addField('Materials', getinv(inventory, 'Materials', client), true)
			.addField('Tools', getinv(inventory, 'Tools', client), true)
			.addField('Food', getinv(inventory, 'Food', client), true)
			.addField('Armor', getinv(inventory, 'Armor', client), true);

		message.channel.send(embed);
		break;

	}
	case 'invadd': {
		if(!user) return message.channel.send('Could not find that user');
		if(!args[2]) return message.channel.send('Please specify an item');

		const t = args.slice(2).join(' ').split('-')[0].trim().toProperCase();
		const locate = find(client, t);
		if(!locate) return message.channel.send('Could not find that item');

		const amount = parseInt(args.join('').split('-')[1]) || 1;
		const inventory = await client.db.getInv(client, message.author.id);
		if(!inventory) return message.channel.send('That user does not have a player');
		const it = inventory[locate].find(x=>x.name === t);
		if(locate === 'tools' && it) return message.channel.send('The player already owns this tool');

		else if(locate === 'tools' || locate === 'armor') inventory[locate].push({ name: t, value: { durability: client.tools[locate.toProperCase()][t].durability, enchant: '' } });
		else (it) ? it.value += amount : inventory[locate].push({ name: t, value: amount });

		await client.db.setInv(inventory, [locate]);
		return message.channel.send(`Successfully added ${amount} ${t} to ${user.tag}`);
	}
	case 'invrem': {
		if(!user) return message.channel.send('Could not find that user');
		if(!args[2]) return message.channel.send('Please specify an item');

		const t = args.slice(2).join(' ').split('-')[0].trim().toProperCase();
		const locate = find(client, t);
		if(!locate) return message.channel.send('Could not find that item');

		const inventory = await db.fetch(`inventory_${user.id}`);
		if(!inventory) return message.channel.send('That user does not have a player');
		if(!inventory[locate][t]) return message.channel.send('The player does not own this tool');

		delete inventory[locate][t];
		await db.set(`inventory_${user.id}`, inventory);

		return message.channel.send(`Successfully removed ${t} from ${user.tag}`);
	}
	case 'addcrate': {
		if(!user) return message.channel.send('Could not find that user');
		if(!args[2]) return message.channel.send('Please specify the type of crate');

		const t = args.slice(2).join(' ').toProperCase();
		if(!client.tools.crates[t]) return message.channel.send('Could not find that crate');
		const inventory = await client.db.getInv(client, message.author.id);
		if(!inventory) return message.channel.send('That user does not have a player');

		inventory.crates.push(t);
		await client.db.setInv(inventory, ['crates']);

		return message.channel.send(`Successfully added a ${t} Crate to ${user.tag}`);
	}
	case 'restore': {
		if(!user) return message.channel.send('Could not find that user');
		const inventory = await client.inv.findOne({ id: user.id });
		if(inventory) return message.channel.send('That user already has a profile.');
		const actualinv = await db.fetch(`inventory_${user.id}`);
		await client.db.createInv(client, user.id, actualinv);
		return message.channel.send(`Successfully restored data of ${user.tag}`);
	}
	case 'shutdown': {
		await message.reply('Bot is shutting down.');
		return client.destroy();
	}
	case 'reload': {
		if(!args[1]) return message.channel.send('Correct format is `s!owner reload [command]`');
		let response = await client.unloadCommand(args[1]);
		if (response) return message.reply(`Error Unloading: ${response}`);

		response = client.loadCommand(args[1]);
		if (response) return message.reply(`Error Loading: ${response}`);

		return message.channel.send(`The command \`${args[1]}\` has been reloaded`);
	}
	case 'reboot': {
		await message.reply('Bot is shutting down and reconnecting');
		client.destroy();
		process.exit(1);
		return;
	}
	case 'backup': {
		const users = await client.inv.find();
		fs.writeFile('backup.js', users, async function(err) {
			if (err) throw err;
			const embed = client.embed(message, { title: '**Backup Success**' })
				.attachFiles([{
					attachment: 'backup.js',
					name: 'backups'
				}])
				.setDescription(`wew.. gotta put something here
**${users.length}** player datas saved!`);
			await message.channel.send(embed);
			fs.unlink('backup.js', function(err) { // Delete the file
				if (err) throw err;
				console.log('File deleted!');
			});
		});
		break;
	}
	case 'username': {
		if(!args[1]) return message.channel.send(`Specify a username for ${client.user.username}`);
		await client.user.setUsername(args[1]);
		return message.channel.send(`Successfully set the username to \`${args[1]}\`!`);
	}
	case 'avatar': {
		if(!args[1]) return message.channel.send(`Specify a url to set the avatar for ${client.user.username}`);
		await client.user.setAvatar(args[1]);
		return message.channel.send('Successfully changed the avatar!');
	}
	case 'dadjoke': {
		fetch.get(url, {
			headers: { Accept: 'application/json' },
		}).then(async res => {
			res = JSON.parse(res.text);
			const embed = new discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle('Dad Joke')
				.setDescription(res.joke)
				.setColor('GREEN')
				.setTimestamp();

			return message.channel.send(embed);
		});
		break;
	}
	case 'addrole': {
		const perms = args[1].toUpperCase();
		const color = args[2].toUpperCase();
		const roleName = args.slice(3).join(' ');
		console.log(perms, roleName);
		message.guild.roles.create({ data: {
			name: roleName,
			color: color,
			permissions: perms,
			hoist: true
		} }).then(role=> {
			message.member.roles.add(role).then(() => message.channel.send(`Successfully created the role ${role} and added it to you!`));
		});
		return;
	}
	case 'test': {
		youtubedl.getInfo('https://vimeo.com/6586873', function(err, info) {
			if (err) throw err;
			console.log(info);
			message.member.voice.channel.join().then(connection => {
				return connection.play(info.url);
			});
		});
		break;
	}
	default: {
		return message.channel.send('That was not an option. The options available are: `inv`, `invadd`, `invrem`, `addcrate`, `reset`, `shutdown`,\
`reload`, `reboot`, `backup`, `username`, `avatar`, `dadjoke`');
	}
	}
};

function find(client, name) {
	if(client.tools.Tools[name]) return 'tools';
	if(client.items.Food[name]) return 'food';
	if(client.items.Materials[name]) return 'materials';
	if(client.tools.Armor[name]) return 'armor';
	if(client.tools.Other[name]) return 'other';
	return false;
}

function getinv(inventory, type, client) {
	const res = {};
	let	m = '**';
	inventory[type.toLowerCase()].forEach(mat => { res[mat.name] = mat.value || 0;});
	for(const v in res) {
		let e = { emote: '' };
		if(client.items[type]) e = client.items[type][v] ;
		else if(client.tools[type]) e = client.tools[type][v];
		let x = `x${res[v]}\n`;
		if(type === 'Tools' || type === 'Armor') x = ` | Durability ${res[v].durability}\n`;
		else if(typeof res[v] === 'object') x = 'x1\n'; // []
		m += `${v}${e.emote} ${x}`;
	}
	m += '**';
	return m;
}

exports.conf = {
	aliases: [],
	permLevel: 9
};

exports.help = {
	name: 'owner',
	group: 'owner',
	description: 'Secret command only availible to the bot admins... how did you get to know about this command? xD',
	usage: 'owner [option] [value]',
};