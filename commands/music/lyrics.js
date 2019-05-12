const Discord = require('discord.js');

module.exports.run = async (client, message, args, {prefix}) => {
	if(!args && !global.guilds[message.guild.id]) return;
	let query = args || global.guilds[message.guild.id].queue[0].title;
  if(!query) return message.channel.send(`Please use \`${prefix}lyrics [song]\` to search for lyrics or \`${prefix}lyrics\` to get the lyrics of the current playing song`)
	message.channel.send(':mag_right:**Searching lyrics for** `' + query + '`');
	let songData = await client.music.lyrics(query).catch(err => {
			message.channel.send(`No lyrics found for: ${query} 🙁`, {code:'asciidoc'});
			return console.warn(err);
		});
			const embeds = [];
			const embed = new Discord.MessageEmbed()
				.setTitle(`Lyrics for: **${songData[0]}**`)
				.setColor('#206694');
			if(songData[1].length < 2000) {
				embed.setDescription(songData[1])
					.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
				embeds.push(embed);
			}
			else {
				embed.setDescription(songData[1].slice(0, 2000));
				embeds.push(embed);
				let embed2 = new Discord.MessageEmbed()
					.setColor('#206694')
					.setDescription(songData[1].slice(2000, 4000))
					.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
				embeds.push(embed2);
			}
			//message.channel.send('Lyrics for ' + songData[0] + '\n\n' + songData[1], { split: true, code: true });
			for(let i = 0; i < embeds.length; i++) {
				await message.channel.send(embeds[i]);
			}
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true,
	cooldown: 10000
};

// Name is the only necessary one.
exports.help = {
	name: 'lyrics',
	description: 'Shows the lyrics of the provided song or the current playing song',
	group: 'music',
	usage: 'lyrics [song]'
};