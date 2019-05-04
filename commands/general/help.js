const discord = require('discord.js');
const db = require('quick.db');

exports.run = (client, message, args) => {
	let embed = new discord.MessageEmbed()
		.setColor('#206694');
	let prefix = message.guild ? db.fetch(`settings_${message.guild.id}`).prefix : client.prefix;
	if(args[0]) {
		const t = args[0].toLowerCase();
		const groups = client.groups;
		let command = client.commands.get(t) || client.commands.get(client.aliases.get(t));
		let group = groups.get(t);
		//= group.map(c => '\n\n**s!' + c.help.name + '**\n' + c.help.description)
		if(group) {
			let curpage = 1;

			message.channel.send(genPage(group, embed, t, curpage, prefix)).then(async mess => {
				await mess.react('⬅');
				await mess.react('➡');

				const collector = mess.createReactionCollector((reaction, u) => u.id === message.author.id, { time: 180000 });
				collector.on('collect', r => {
					if(r.emoji.name === '⬅') {
						curpage --;
						mess.edit(genPage(group, embed, t, curpage, prefix));
					} else if (r.emoji.name === '➡') {
						curpage ++;
						mess.edit(genPage(group, embed, t, curpage, prefix));
					}
				});
				collector.on('end', async () => await mess.reactions.removeAll());
			});
		} else if(command) {
			embed.setTitle(`**${command.help.name.toProperCase()}**`)
				.setDescription(`
**Group** ${command.help.group.toProperCase()}

**Description**
${command.help.description}

**Usage**
\`${prefix}${command.help.usage}\`
${command.conf.aliases[0] ? '\n**Aliases**\n`' + command.conf.aliases.join(', ') + '`' : ''}
${command.conf.examples ? '\n**Examples**\n`' + command.conf.examples.join('\n') + '`' : ''}
`);
			return message.channel.send(embed);
		}
	}  else {
		embed.setTitle(`**Commands List ${client.commands.size}**`)
			.setDescription(`
The prefix for ${message.guild ? message.guild.name : client.user.username} is \`${prefix}\`

Availible groups are :
`)
			.addField('**Economy**', `\`${prefix}help economy\``, true)
			.addField('**Music**', `\`${prefix}help music\``, true)
			.addField('**General**', `\`${prefix}help general\``, true)
			.addField('**Fun**', `\`${prefix}help fun\``, true)
			.addField('\u200b', `Use \`${prefix}help [command]\` to view detailed information about the command

Use \`${prefix}help [group]\` to view all the commands in the group

Join the support server for further help!

Documentation coming soon!
`);
		return message.channel.send(embed);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['h', 'halp']
};

exports.help = {
	name: 'help',
	group: 'general',
	description: 'Displays all the available commands and details!',
	usage: 'help [command]'
};

function genPage(group, embed, t, curpage, prefix) {
	let m = '';
	let pages = Math.ceil(group.size / 10);
	let count = 0;
	group.forEach(c => {
		if(count < curpage * 10 && count >= (curpage - 1) * 10) {
			m += `\n\n**${count+1}] ${prefix}${c.help.name}**\n${c.help.description}`;
		}
		count ++;
	});
	embed.setTitle(t.toProperCase())
		.setDescription(`
${group.size} commands in ${t.toProperCase()}

Use \`${prefix}help [command]\` to view detailed information about a command${m}`)
		.setFooter(`Page ${curpage}/${pages}`);
	return embed;
}