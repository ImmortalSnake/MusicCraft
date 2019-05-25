/* eslint-disable no-useless-escape */
const db = require('quick.db');
const discord = require('discord.js');
const fetch = require('node-superfetch');
const url = 'https://icanhazdadjoke.com/';
const fs = require('fs');
const sources = ['akairo', 'akairo-master', 'commando'];

module.exports.run = async (client, message, args, { prefix, mc }) => {
	if(!client.config.admins.includes(message.author.id)) return message.reply ('you are not allowed to use this command');
	if(!args[0]) return message.channel.send(`Correct format is \`${prefix}owner [option]\``);
	const user = client.users.get(args[1]) || message.mentions.users.first();

	switch(args[0].toLowerCase()) {

	case 'inv': {

		if(!user) return message.channel.send('Could not find that user');
		const inventory = await mc.get(user.id);
		if(!inventory) return message.channel.send('That user does not have a player');
		const embed = client.embed(message, { title: '**Inventory**' })
			.setFooter(user.username, user.displayAvatarURL())
			.addField('Materials', mc.ishow(inventory, 'Materials'), true)
			.addField('Tools', mc.ishow(inventory, 'Tools'), true)
			.addField('Food', mc.ishow(inventory, 'Food'), true)
			.addField('Armor', mc.ishow(inventory, 'Armor'), true);

		return message.channel.send(embed);
	}
	case 'invadd': {
		if(!user) return message.channel.send('Could not find that user');
		if(!args[2]) return message.channel.send('Please specify an item');

		const t = args.slice(2).join(' ').split('-')[0].trim().toProperCase();
		const locate = mc.find(t);
		if(!locate) return message.channel.send('Could not find that item');

		const amount = parseInt(args.join('').split('-')[1]) || 1;
		const inventory = await mc.get(message.author.id);
		if(!inventory) return message.channel.send('That user does not have a player');
		const it = inventory[locate.name].find(x=>x.name === t);
		if(locate.name === 'tools' && it) return message.channel.send('The player already owns this tool');

		else if(locate.name === 'tools' || locate.name === 'armor') inventory[locate.name].push({ name: t, value: { durability: locate.value.durability, enchant: '' } });
		else (it) ? it.value += amount : inventory[locate.name].push({ name: t, value: amount });

		await mc.set(inventory, [locate.name]);
		return message.channel.send(`Successfully added ${amount} ${t} to ${user.tag}`);
	}
	case 'invrem': {
		if(!user) return message.channel.send('Could not find that user');
		if(!args[2]) return message.channel.send('Please specify an item');

		const t = args.slice(2).join(' ').split('-')[0].trim().toProperCase();
		const locate = mc.find(t);
		if(!locate) return message.channel.send('Could not find that item');

		const inventory = await db.fetch(`inventory_${user.id}`);
		if(!inventory) return message.channel.send('That user does not have a player');
		if(!inventory[locate.name][t]) return message.channel.send('The player does not own this tool');

		delete inventory[locate.name][t];
		await db.set(`inventory_${user.id}`, inventory);

		return message.channel.send(`Successfully removed ${t} from ${user.tag}`);
	}
	case 'addcrate': {
		if(!user) return message.channel.send('Could not find that user');
		if(!args[2]) return message.channel.send('Please specify the type of crate');

		const t = args.slice(2).join(' ').toProperCase();
		if(!mc.crates[t]) return message.channel.send('Could not find that crate');
		const inventory = await mc.get(message.author.id);
		if(!inventory) return message.channel.send('That user does not have a player');

		inventory.crates.push(t);
		await mc.set(inventory, ['crates']);

		return message.channel.send(`Successfully added a ${t} Crate to ${user.tag}`);
	}
	case 'restore': {
		if(!user) return message.channel.send('Could not find that user');
		const inventory = await mc.get(user.id);
		if(inventory) return message.channel.send('That user already has a profile.');
		const actualinv = await db.fetch(`inventory_${user.id}`);
		await mc.create(user.id, actualinv);
		return message.channel.send(`Successfully restored data of ${user.tag}`);
	}
	case 'shutdown': {
		await message.reply('Bot is shutting down.');
		return client.destroy();
	}
	case 'reload': {
		if(!args[1]) return message.channel.send(`Correct format is \`${prefix}owner reload [command]\``);
		let response = await client.handlers.unloadCommand(args[1]);
		if (response) return message.reply(`Error Unloading: ${response}`);

		response = client.handlers.loadCommand(args[1]);
		if (response) return message.reply(`Error Loading: ${response}`);

		return message.channel.send(`The command \`${args[1]}\` has been reloaded`);
	}
	case 'reboot': {
		await message.reply('Bot is shutting down and reconnecting');
		client.destroy();
		return process.exit(1);
	}
	case 'backup': {
		const users = await mc.inv.find();
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
	case 'docs': {
		let query = args.slice(1).join(' ');
		if(!query) return message.channel.send('Please specify something to search');
		if(query.includes('--')) query = query.split('--')[0];
		let type = args.join(' ').split('--')[1] || 'stable';
		if(!sources.includes(type)) type = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${type}.json`;
		fetch.get(`https://djsdocs.sorta.moe/v2/embed?src=${type}&q=${query}`)
			.then((res) => {
				if(!res.body) return message.channel.send('Could not fetch any search results');
				return message.channel.send({ embed: res.body });
			})
			.catch(() => {
				return message.channel.send('Could not fetch any search results. Invalid source');
			});
		break;
	}
	default: {
		return message.channel.send('That was not an option. The options available are: `inv`, `invadd`, `invrem`, `addcrate`, `reset`, `shutdown`,\
`reload`, `reboot`, `backup`, `username`, `avatar`, `dadjoke`, `docs`');
	}
	}
};

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