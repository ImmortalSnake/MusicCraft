exports.run = async (client, message, args, { mc, prefix }) => {
	let inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);

	const r = inventory.equipped.find(x=>x.name === 'rod').value;
	if(!r) return message.channel.send(`You do not have a fishing rod. Use \`${prefix}craft fishing rod\` to craft one`);

	inventory = mc.activity(inventory, this, message, prefix);
	if(!inventory) return;

	const rod = mc.Tools[r];
	let result;
	for(const drops in rod.drops) {
		if(Math.random() > rod.drops[drops]) result = drops;
	}
	if(result) {
		const res = inventory.food.find(x=>x.name === result);
		res ? res.value++ : inventory.food.push({ name: result, value: 1 });
	}
	else result = 'Nothing';
	const fish = mc.Food[result] || { emote: '' };
	const embed = client.embed(message).setDescription(`**:fishing_pole_and_fish: Fish

${message.author.username} tried to fish with a ${r} and found
${result} ${fish.emote}**`);

	await mc.set(inventory, ['tools', 'food']);
	return message.channel.send(embed);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	cooldown: 30 * 60 * 1000
};

exports.help = {
	name: 'fish',
	description: 'Catch fish which you can eat after cooking!',
	group: 'economy',
	usage: 'fish',
};