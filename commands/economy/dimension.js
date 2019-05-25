exports.run = async (client, message, args, { mc, prefix }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);
	const dim = args.join(' ').toLowerCase();
	let bal = inventory.money;
	if(!dim) return message.channel.send(`Please use \`${prefix}dim [nether/overworld]\``);
	const embed = client.embed(message, { title: '**Dimension**' });
	switch(dim) {
	case 'overworld': {
		if(inventory.dimension === 'Overworld') return message.channel.send('You are already in the Overworld');
		inventory.dimension = 'Overworld';
		if(bal < 1000) return message.channel.send('You need atleast 1000 coins to go to the nether world');
		bal -= 1000;
		inventory.dimension = 'Overworld';
		await mc.set(inventory, []);
		embed.setDescription('You have teleported back to the Overworld safely!');
		return message.channel.send(embed);
	}
	case 'nether': case 'netherworld': {
		if(inventory.dimension === 'Nether') return message.channel.send('You are already in the Netherworld');
		if(!inventory.other['Nether Portal']) return message.channel.send('You need to craft a nether portal to get to the Netherworld');
		if(bal < 1000) return message.channel.send('You need atleast 1000 coins to go inside the nether portal');
		bal -= 1000;
		inventory.dimension = 'Nether';
		await mc.set(inventory, []);
		embed.setDescription(`You have teleported to the Nether using a Nether Portal ${mc.Other['Nether Portal'].emote}!`);
		return message.channel.send(embed);
	}
	default: return message.channel.send(`Please use \`${prefix}dim [nether/overworld]\``);
	}
};

exports.conf = {
	aliases: ['dim'],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'dimension',
	description: 'Travel to different dimensions with this command!',
	group: 'economy',
	usage: 'dimension [dimension name]'
};