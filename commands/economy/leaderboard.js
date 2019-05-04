module.exports.run = async (client, message) => {
	let total = await client.inv.find();
	let money = total.sort((a, b) => (a.money > b.money) ? -1 : ((b.money > a.money) ? 1 : 0));
	let content = '**';
	let pos;
	for(let i = 0; i < money.length; i++) {
		if(i < 20) {
			let user = client.users.get(money[i].id);
			if(!user) continue;
			else {
				if(user.id === message.author.id) pos = i+1;
				content += `${i+1}. ${user.tag} ~ ${money[i].money}\n`;
			}
		}
	}
	content += `**........\nYour position **${pos}**`;
	const embed = client.embed(message)
		.setDescription(content);
	message.channel.send(embed);
};

exports.conf = {
	aliases: ['lb'],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'leaderboard',
	description: 'Shows the richest and highest level players!',
	group: 'economy',
	usage: 'leaderboard'
};
