const slots = ['🍇', '🍒', '🍋'];

module.exports.run = async (client, message, args, { mc, prefix }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);
	const bet = parseInt(args[0]);
	if(!bet) return message.channel.send('Specify the amount you want to bet');
	const balance = inventory.money;
	if(bet > balance) return message.channel.send('You dont have enough money');
	const result1 = (Math.floor(Math.random() * slots.length));
	const result2 = (Math.floor(Math.random() * slots.length));
	const result3 = (Math.floor(Math.random() * slots.length));

	const random1 = result1 > 0 ? result1 - 1 : slots.length - 1;
	const random2 = result2 > 0 ? result2 - 1 : slots.length - 1;
	const random3 = result3 > slots ? result3 - 1 : slots.length - 1;
	const random4 = result1 < slots.length - 1 ? result1 + 1 : 0;
	const random5 = result2 < slots.length - 1 ? result2 + 1 : 0;
	const random6 = result3 < slots.length - 1 ? result3 + 1 : 0;
	const m = `
${slots[random1]} ${slots[random2]} ${slots[random3]}
**----------------**
${slots[result1]} ${slots[result2]} ${slots[result3]} **<<<**
**----------------**
${slots[random4]} ${slots[random5]} ${slots[random6]}
`;
	const embed = client.embed(message);
	if (result1 === result2 && result1 === result3) {
		inventory.money += bet * 10;
		await mc.set(inventory, []);
		embed.setDescription(`${m}
You won ${bet * 10}!
			`)
			.setColor('GREEN');
		message.channel.send(embed);
	} else {
		inventory.money -= bet;
		await mc.set(inventory, []);
		embed.setDescription(`
			${m}
			You lost ${bet}, better luck next time!`)
			.setColor('RED');
		message.channel.send(embed);
	}
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true,
	cooldown: 10000
};

exports.help = {
	name: 'slots',
	description: 'Play a game of slots. You recieve 10x the bet if you win!',
	group: 'economy',
	usage: 'slots [bet]'
};