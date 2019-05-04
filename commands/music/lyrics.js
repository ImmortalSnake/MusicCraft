const Discord = require('discord.js');
const getArtistTitle = require('get-artist-title');
const axios = require('axios');
const cheerio = require('cheerio');
const settings = process.env;
const baseURL = `https://api.genius.com/search?access_token=${settings.GENIUS}`;

module.exports.run = async (client, message, args) => {
	if(!args && !global.guilds[message.guild.id]) return;
	let find = args || global.guilds[message.guild.id].queue[0].title;
	const query = createQuery(find);
	message.channel.send(':mag_right:**Searching lyrics for** `' + query + '`');
	searchLyrics(`${baseURL}&q=${encodeURIComponent(query)}`)
		.then(async songData => {
			const embeds = [];
			const embed = new Discord.MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL())
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
					.setDescription(songData[1].slice(2000))
					.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
				embeds.push(embed2);
			}
			//message.channel.send('Lyrics for ' + songData[0] + '\n\n' + songData[1], { split: true, code: true });
			for(let i = 0; i < embeds.length; i++) {
				await message.channel.send(embeds[i]);
			}
		})
		.catch(err => {
			message.channel.send(`No lyrics found for: ${query} 🙁`, {code:'asciidoc'});
			console.warn(err);
		});
};

const scrapeLyrics = path => {
	return axios.get(path)
		.then(response => {
			let $ = cheerio.load(response.data);
			return [$('.header_with_cover_art-primary_info-title').text().trim(), $('.lyrics').text().trim()];
		})
		.catch(err => {
			console.warn(err);
		});
};

const searchLyrics = url => {
	return Promise.resolve(axios.get(url, {'Authorization': `Bearer ${settings.GENIUS}`})
		.then(response => checkSpotify(response.data.response.hits))
		.then(path => scrapeLyrics(path))
		.catch(err => {
			console.warn(err);
		})
	);
};

const checkSpotify = hits => {
	return hits[0].result.primary_artist.name === 'Spotify' ? hits[1].result.url : hits[0].result.url;
};

const createQuery = arg => {
	if (arg === 'np') {
		const query = [ artist, title ] = getArtistTitle(playlist.current, {
			defaultArtist: ' '
		});
		console.log(query);
		return query.join(' ');
	} else return arg;
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