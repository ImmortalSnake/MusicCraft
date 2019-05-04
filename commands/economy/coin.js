const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
	let inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have a profile. Use the `s!start` command');

	const chance = Math.floor(Math.random() * 2);
	const embed = new Discord.MessageEmbed();
	const heads = client.emojis.find(emoji => emoji.name === 'heads');
	const tails = client.emojis.find(emoji => emoji.name === 'tails');

	let choice = args.slice(0, 1).join('').toLowerCase() || 'heads';
	let bet = parseInt(args.slice(1).join('')) || 10;

	embed.setFooter(message.author.username, message.author.displayAvatarURL());
	let result = false;

	if(chance === 0) {
		embed.setTitle(`${heads} Your coin has landed on heads!`);
		if(choice === 'heads' || choice === 'head') {
			result = true;
		}
	} else {
		embed.setTitle(`${tails} Your coin has landed on tails!`);
		if(choice === 'tails' || choice === 'tail') {
			result = true;
		}
	}
	if(choice && choice === 'tails' || choice === 'tail' || choice === 'heads' || choice === 'head') {
		let coin = inventory.money;
		if(coin >= bet) {
			if(result === false) {
				embed.setDescription('You lost ' + bet + ' coins')
					.setColor('RED');
				inventory.money -= bet;
			}
			else {
				embed.setDescription('You won ' + bet + ' coins')
					.setColor('GREEN');
				inventory.money += bet;
			}
			await client.db.setInv(inventory, []);
		} else {
			embed.setDescription('You don\t have enough coins');
		}
	}
	return message.channel.send(embed);
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
