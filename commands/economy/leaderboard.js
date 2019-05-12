module.exports.run = async (client, message, args, {prefix}) => {
	let total = await client.inv.find();
  let type = args[0] || 'money';
  let sorted, t, content = '', pos
  switch(type.toLowerCase()) {
    case 'money': case 'cash':
      sorted = total.sort((a, b) => (a.money > b.money) ? -1 : ((b.money > a.money) ? 1 : 0));
      t = 'money'
      break;
    case 'xp': case 'level':
      sorted = total.sort((a, b) => (a.xp > b.xp) ? -1 : ((b.xp > a.xp) ? 1 : 0));
      t = 'xp'
      break;
    default:
      return message.channel.send(`Please use \`${prefix}lb money\` or \`${prefix}lb xp\``);
  }

	for(let i = 0; i < sorted.length; i++) {
		if(i < 20) {
			let user = client.users.get(sorted[i].id);
			if(!user) continue;
			else {
				if(user.id === message.author.id) pos = i+1;
				content += `**${i+1}]** ${user.tag} ~ \`${sorted[i][t]}${t==='money'? '$': ` ${t}`}\`\n`;
			}
		}
	}
	content += `........\nYour position **${pos}/${sorted.length}**`;
	const embed = client.embed(message).setDescription(content);
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
