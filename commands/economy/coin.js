exports.run = async (client, message, args, { mc }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send('You do not have a profile. Use the `s!start` command');

	const chance = Math.floor(Math.random() * 2);
	const embed = client.embed(message);
	const heads = client.emojis.find(emoji => emoji.name === 'heads');
	const tails = client.emojis.find(emoji => emoji.name === 'tails');
	const choice = args.slice(0, 1).join('').toLowerCase() || 'heads';
	const bet = parseInt(args.slice(1).join('')) || 10;
	let result = false;

	if(chance === 0) {
		embed.setTitle(`${heads} Your coin has landed on heads!`);
		if(choice === 'heads' || choice === 'head') result = true;
	} else {
		embed.setTitle(`${tails} Your coin has landed on tails!`);
		if(choice === 'tails' || choice === 'tail') result = true;
	}
	if(choice && choice === 'tails' || choice === 'tail' || choice === 'heads' || choice === 'head') {
		const coin = inventory.money;
		if(coin >= bet) {
			if(result === false) {
				embed.setDescription(`You lost ${bet} coins`).setColor('RED');
				inventory.money -= bet;
			}
			else {
				embed.setDescription(`You won ${bet} coins`).setColor('GREEN');
				inventory.money += bet;
			}
			await mc.set(inventory, []);
		} else embed.setDescription('You don\t have enough coins');
	}
	return await message.channel.send(embed);
};

exports.conf = {
	aliases: ['coinflip'],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'coin',
	description: 'Flips a coin, gives 2x cash if you win the bet!',
	group: 'economy',
	usage: 'coin [heads / tails] [bet]'
};
