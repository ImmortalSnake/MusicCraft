exports.run = async (client, message, args, { prefix, mc }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);
	const query = args.join(' ').toUpperCase();
	const code = await mc.getCode(query);
	if(!code) return message.channel.send('Invalid Code');
	if(code.expired) return message.channel.send('Sorry, this code is expired');
	if(inventory.codes && inventory.codes.find(x=>x === query)) return message.channel.send('You already used this code');
	const embed = client.embed(message, { title: '**Code Redeemed**' })
		.setDescription(`You have redeemed the code **${query}**
You recieved a **${code.rewards} Crate**
Use \`${prefix}crate ${code.rewards}\` to open it!`);
	inventory.crates.push(code.rewards);
	inventory.codes ? inventory.codes.push(query) : inventory.codes = [query];
	await mc.set(inventory, ['crates', 'codes']);
	return message.channel.send(embed);
};

exports.conf = {
	aliases: [],
	enabled: false,
	guildOnly: true
};

exports.help = {
	name: 'redeem',
	description: 'Recieved a code? Redeem it!',
	group: 'economy',
	usage: 'redeem [code]'
};