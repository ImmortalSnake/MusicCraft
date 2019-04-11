const { stripIndents, oneLine } = require('common-tags');

module.exports.run = async (client, msg, args) => {
		// Just output the prefix
		if(!args[0]) {
			const prefix = msg.guild ? msg.guild.prefix : client.prefix;
			return msg.reply(stripIndents`
				${prefix ? `The command prefix is \`\`${prefix}\`\`.` : 'There is no command prefix.'}
				To run commands, use \`${prefix}command\`.
			`);
		}
  if(args[0].length > 5) return msg.channel.send('The prefix cannot be more than 5 characters long')
		// Check the user's permission before changing anything
		if(msg.guild) {
			if(!msg.member.hasPermission('ADMINISTRATOR') && !client.isOwner(msg.author)) {
				return msg.reply('Only administrators may change the command prefix.');
			}
		} else if(!client.isOwner(msg.author)) {
			return msg.reply('Only the bot owner(s) may change the global command prefix.');
		}

		// Save the prefix
		const lowercase = args[0].toLowerCase();
		const prefix = lowercase === 'none' ? '' : args[0];
		let response;
		if(lowercase === 'default') {
			if(msg.guild) msg.guild.prefix = null; else client.prefix = null;
			const current = client.prefix ? `\`\`${client.prefix}\`\`` : 'no prefix';
			response = `Reset the command prefix to the default (currently ${current}).`;
		} else {
			if(msg.guild) msg.guild.prefix = prefix; else client.prefix = prefix;
			response = prefix ? `Set the command prefix to \`\`${args[0]}\`\`.` : 'Removed the command prefix entirely.';
		}

		await msg.reply(`${response} To run commands, use \`${prefix}command\`.`);
		return null;
	}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: false
};

// Name is the only necessary one.
exports.help = {
  name: 'prefix',
  description: 'Evaluates a JS code.',
  group: 'general',
  usage: 'reload [command]'
}
