exports.run = async (client, message, args, { prefix, mc }) => {
	let inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);

	inventory = mc.activity(inventory, this, message, prefix);
	if(!inventory) return;

	const eaxe = inventory.equipped.find(e => e.name === 'axe').value; // equipped axe name
	const iaxe = inventory.tools.find(e => e.name === eaxe).value; // axe in inventory
	const axe = mc.Tools[eaxe]; // axe stats

	if(iaxe.durability < 1) return message.channel.send(`You cannot use this axe anymore as it is broken, please use \`${prefix}repair ${eaxe}\` to repair it`);

	const drops = Math.floor(Math.random() * axe.drops[1]) + axe.drops[0];
	const wood = mc.Materials.Wood, rand = Math.random();
	inventory = mc.iadd(inventory, { name: 'Wood', value: drops, locate: 'materials' });

	iaxe.durability--;
	let apple = false;

	if(rand > 0.9) apple = true;
	if(apple) inventory = mc.iadd(inventory, { name: 'Apple', value: 1, locate: 'food' });

	await mc.set(inventory, ['materials', 'tools', 'food']);

	const embed = client.embed(message, { title: '**Chop**' })
		.setDescription(`**${message.author.username} chopped wood with ${axe.emote}
You got ${drops} ${wood.emote}${apple ? `\n You found an Apple ${mc.Food['Apple'].emote}` : '' }**`);
	return await message.channel.send(embed);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 5000
};

exports.help = {
	name: 'chop',
	description: 'Chop trees to get wood! Apple drops ocassionaly',
	group: 'economy',
	usage: 'chop'
};