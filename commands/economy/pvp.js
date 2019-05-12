const discord = require('discord.js');

exports.run = async (client, message) => {
	let inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have a player. Use the `s!start` command to get started');
	let member = message.mentions.members.first();
	if(!member) return message.reply('Mention the user you want to fight with');

	let inventory2 = await client.db.getInv(client, member.id);
	if(!inventory2) return message.channel.send('That user does not have a player');

	message.channel.send(member.user.username + ', Do you accept the fight?')
		.then(async m => {
			await m.react('✅');
			await m.react('❎');
			const collector = m.createReactionCollector((reaction, u) => u.id === member.id, { time: 240000 });
			collector.on('collect', async (r) => {
				if(r.emoji.name === '❎'){
					message.channel.send(member.user.username + ' did not accept the fight');
					collector.stop();
				}
				else if(r.emoji.name === '✅') {
					let stats = await calc(client, inventory, inventory2);
					console.log(stats);
					moves(client, message, stats);
					collector.stop();
				}
			});
			collector.on('end', async (r) => {
				if(r.size === 0) return message.reply(member.user + ' did not accept the fight');
			});
		});
};

async function moves(client, message, stats) {
	let player = stats.first;
	let opp = stats.second;
	let user1 = client.users.get(player.id);
	let user2 = client.users.get(opp.id);
	let embed = new discord.MessageEmbed()
		.setTitle('FIGHT')
		.setColor('GREEN')
		.setAuthor(user1.username, user1.displayAvatarURL())
		.setDescription(`**Pick Your Move (Attack / Defend) ${user1}\n\n${user1} | Health: ${player.hp} Attack: ${player.dmg}\n\n${user2} | Health: ${opp.hp} Attack: ${opp.dmg}**`);
	message.channel.send(embed)
		.then(async m => {
			await m.react('🇦');
			await m.react('🇩');
			const collector = m.createReactionCollector((reaction, u) => u.id === user1.id, { time: 240000 });
			collector.on('collect', async (r) => {
				if(r.emoji.name === '🇦') {
					collector.stop();
					let success = 0;
					(Math.random()  > opp.cdef[0]) ? success++ : success--;
					if(success > 0) {
						opp.hp -= player.crit;
					} else {
						opp.hp -= player.dmg - Math.ceil(Math.random() * 10);
					}
					if(player.hp < 0) return win(message, user2, user1);
					else if(opp.hp < 0) return win(message, user1, user2);
					let temp = stats.first;
					stats.first = stats.second;
					stats.second = temp;
					moves(client, message, stats);
				}
				else if(r.emoji.name === '🇩') {
					collector.stop();
					let success = 0;
					(Math.random()  > 0.5) ? success++ : success--;
					if(success > 0) {
						player.hp += Math.ceil(Math.random() * player.def[1]) + player.def[0];
					} else {
						player.hp += Math.ceil(Math.random() * player.def[1]);
					}
					if(player.hp <= 0) return win(message, user2, user1);
					else if(opp.hp <= 0) return win(message, user1, user2);
					let temp = stats.first;
					stats.first = stats.second;
					stats.second = temp;
					moves(client, message, stats);
				}
			});
		});
}

function win(message, winner, loser) {
	let embed = new discord.MessageEmbed()
		.setTitle('Fight')
		.setColor('GREEN')
		.setAuthor(winner.username, winner.displayAvatarURL())
		.setDescription(`${winner} defeated ${loser}.`)
		.setFooter(loser.username, loser.displayAvatarURL());
	message.channel.send(embed);
}

async function calc(client, player1, player2) {
	let info1 = {
		hp: player1.health + (inv(player1, 'chestplate') ? client.tools.Armor[inv(player1, 'chestplate')].health : 0),
		dmg: player1.attack + (inv(player1, 'sword') ? client.tools.Tools[inv(player1, 'sword')].dmg : 0),
		crit: inv(player1, 'sword') ? client.tools.Tools[inv(player1, 'sword')].critical : 20,
		def: inv(player2, 'chestplate') ? client.tools.Armor[inv(player1, 'chestplate')].defense : [1, 5],
		cdef: inv(player1, 'helmet') ? client.tools.Armor[inv(player1, 'helmet')].crit : [0.5, 0],
		sp: player1.speed + (inv(player1, 'boots') ? client.tools.Armor[inv(player1, 'boots')].speed : 0),
		luck: player1.luck,
		id: player1.id
	};
	let info2 = {
		hp: player2.health + (player2.equipped.chestplate ? client.tools.Armor[player2.equipped.chestplate].health : 0),
		dmg: player2.attack + (inv(player2, 'sword') ? client.tools.Tools[inv(player2, 'sword')].dmg : 0),
		crit: inv(player2, 'sword') ? client.tools.Tools[inv(player2, 'sword')].critical : 20,
		def: inv(player2, 'chestplate') ? client.tools.Armor[inv(player2, 'chestplate')].defense : [1, 5],
		cdef: inv(player2, 'helmet') ? client.tools.Armor[inv(player2, 'helmet')].crit : [0.5, 0],
		sp: player2.speed + (inv(player2, 'boots') ? client.tools.Armor[inv(player2, 'boots')].speed : 0),
		luck: player2.luck,
		id: player2.id
	};
	let result = {
		first: (Math.random() * (5 + info1.luck) + info1.sp > Math.random() * (5 + info2.luck) + info2.sp) ? info1: info2, // calculates the user who is gonna get the first move. Calculated using luck and chance
		second: {}
	};
	result.second = (result.first.id === info1.id) ? info2 : info1;
	return result;
}

function inv(inventory, n){
	return inventory.equipped.find(x=>x.name===n);
}

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'pvp',
	description: 'Challenge another user to a battle!',
	group: 'economy',
	usage: 'pvp [@user]'
};