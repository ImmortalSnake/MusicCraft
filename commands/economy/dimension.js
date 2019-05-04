exports.run = async (client, message, args) => {
	let inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have any materials. Use the `s!start` command to start');
	let dim = args.join(' ').toLowerCase();
	let bal = inventory.money;
	if(!dim) return message.channel.send('Please use `s!dim [nether/overworld]`');
	let embed = client.embed(message, {title: '**Dimension**'});
	switch(dim) {
	case 'overworld': {
		if(inventory.dimension === 'Overworld') return message.channel.send('You are already in the Overworld');
		inventory.dimension = 'Overworld';
		if(bal < 1000) return message.channel.send('You need atleast 1000 coins to go to the nether world');
		bal -= 1000;
		inventory.dimension = 'Overworld';
		await client.db.setInv(inventory, []);
		embed.setDescription('You have teleported back to the Overworld safely!');
		message.channel.send(embed);
		break;
	}
	case 'nether': case 'netherworld': {
		if(inventory.dimension === 'Nether') return message.channel.send('You are already in the Netherworld');
		if(!inventory.other['Nether Portal']) return message.channel.send('You need to craft a nether portal to get to the Netherworld');
		if(bal < 1000) return message.channel.send('You need atleast 1000 coins to go inside the nether portal');
		bal -= 1000;
		inventory.dimension = 'Nether';
		await client.db.setInv(inventory, []);
		embed.setDescription(`You have teleported to the Nether using a Nether Portal ${client.tools.Other['Nether Portal'].emote}!`);
		message.channel.send(embed);
		break;
	}
	default: return message.channel.send('Please use `s!dim [nether/overworld]`');
	}
};

exports.conf = {
	aliases: ['dim'],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'dimension',
	description: 'Travel to different dimensions with this command!',
	group: 'economy',
	usage: 'dimension [dimension name]'
};