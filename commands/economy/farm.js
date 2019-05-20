exports.run = async (client, message, args, { mc, prefix }) => {
	let inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send('You do not have a hoe. Use the `s!start` command to get an hoe');

	inventory = mc.activity(inventory, this, message, prefix);
	if(!inventory) return;
	const hoe = inventory.equipped.find(x=>x.name === 'hoe');
	if(!hoe) return message.channel.send('You do not have an hoe. Use `s!craft wooden hoe` to get a hoe');
	const ihoe = inventory.tools.find(x=>x.name === hoe.value);
	if(ihoe.value.durability < 1) return message.channel.send(`You cannot use this hoe anymore as it is broken, please use \`s!repair ${hoe.value}\` to repair it`);
	ihoe.value.durability--;
	const ehoe = mc.Tools[hoe.value];
	const drops = Math.floor(Math.random() * ehoe.drops[1]) + ehoe.drops[0];
	const rand = ['Potato', 'Carrot', 'Wheat'].random();
	const food = mc.Food[rand];
	const ifood = inventory.food.find(foo=>foo.name === rand);
	ifood ? ifood.value += drops : inventory.food.push({ name: rand, value:drops });
	await mc.set(inventory, ['tools', 'food']);
	const embed = client.embed(message, { title: '**Farm**' })
		.setDescription(`**${message.author.username} farmed with ${ehoe.emote}.
You got ${drops} ${food.emote}.**`);
	message.channel.send(embed);

};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	perms: [],
	botPerms: [],
	cooldown: 300 * 1000
};

exports.help = {
	name: 'farm',
	description: 'Farm for food!',
	group: 'economy',
	usage: 'farm',
};