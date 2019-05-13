exports.run = async (client, message, args, { prefix }) => {
	const inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have food. Use the `s!start` command to get food');
	const query = args.join(' ').toUpperCase();
	const code = client.shop.codes[query];
	if(!code) return message.channel.send('Invalid Code');
	if(query.expired) return message.channel.send('Sorry, this code is expired');
	if(inventory.codes && inventory.codes.find(x=>x === query)) return message.channel.send('You already used this code');
	const embed = client.embed(message, { title: '**Code Redeemed**' })
		.setDescription(`You have redeemed the code **${query}**
You recieved a **${code.rewards} Crate**
Use \`${prefix}crate ${code.rewards}\` to open it!`);
	inventory.crates.push(code.rewards);
	inventory.codes ? inventory.codes.push(query) : inventory.codes = [query];
	await client.db.setInv(inventory, ['crates', 'codes']);
	return message.channel.send(embed);
};

exports.conf = {
	aliases: [],
	enabled: false,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'redeem',
	description: 'Recieved a code? Redeem it!',
	group: 'economy',
	usage: 'redeem [code]'
};