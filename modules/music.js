const youtubedl = require('youtube-dl');
const ytdl = require('ytdl-core-discord');
const fetch = require('node-superfetch');
const cheerio = require('cheerio');
const baseURL = `https://api.genius.com/search?access_token=${process.env.GENIUS}`;
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.yt_api_key);

module.exports.play = async (client, message, settings) => {
	const guildq = global.guilds[message.guild.id];
	guildq.voiceChannel = message.member.voice.channel;
	guildq.voiceChannel.join().then(async function(connection) {
		getStream(guildq, stream => {
			guildq.dispatcher = connection.play(stream.url, stream.options);
			guildq.isPlaying = true;
			if(settings.announcesongs === 'on') message.channel.send(`Now playing **${guildq.queue[0].title}**`);
			guildq.skippers = [];
			guildq.dispatcher.on('end', function() {
				guildq.skippers = [];
				if(guildq.looping) return client.music.play(client, message, settings);
				else guildq.queue.shift();
				if (guildq.queue.length === 0) {
					guildq.queue = [];
					guildq.isPlaying = false;
					message.guild.voiceConnection.disconnect();
					message.channel.send('Music finished, Leaving the Voice Channel');
				} else { // queue here
					setTimeout(function() {
						client.music.play(client, message, settings);
					}, 500);
				}
			});
		});
	});
};

module.exports.lyrics = async (query) => {
	const url = `${baseURL}&q=${encodeURIComponent(query)}`;
	const response = await fetch.get(url).catch(err => console.warn(err));
	const path = checkSpotify(response.body.response.hits);
	const lyrics = await scrapeLyrics(path);
	return lyrics;
};

module.exports.yt = youtube;

module.exports.check = function(message, settings, options) {
	let guildq = global.guilds[message.guild.id];
	if (!guildq) guildq = global.guilds[message.guild.id] = message.client.defaultQueue;
	// let settings = await db.fetch(`settings_${message.guild.id}`);
	if(settings.musicChannel && !message.guild.channels.get(settings.musicChannel)) settings.musicChannel = '';
	if(settings.djRole && !message.guild.roles.get(settings.djRole)) settings.djRole = '';
	const res = [
		`Sorry, only members with the **DJ Role** \`${message.guild.roles.get(settings.djRole) ? message.guild.roles.get(settings.djRole).name : ''}\` can use this command`,
		`Sorry, all music commands can be used only in **${message.guild.channels.get(settings.musicChannel)}**`,
		'You need to be in a voice channel to use this command!',
		'Currently playing something in another voice channel',
		'There is nothing playing'
	];
	if(settings.musicChannel && message.channel.id !== settings.musicChannel) return res[1];
	if(options.vc && !message.member.voice.channel) return res[2];
	if(guildq.isPlaying && guildq.voiceChannel !== message.member.voice.channel) return res[3];
	if (options.playing && !guildq.queue[0]) return res[4];
	if(settings.djRole && options.djrole && !message.member.roles.has(settings.djRole) && !message.member.hasPermission('ADMINISTRATOR')) {
		if(options.vc && message.member.voice.channel.members.size > 2) return res[0];
		else if(!options.vc) return res[0];
	}

	return false;
};

exports.add = (client, data, message, options) => {
	const guildq = global.guilds[message.guild.id];
	guildq.queue.push({
		skippers: [],
		requestor: message.author.id,
		url: options.url,
		title: data.title,
		seek: 0,
		type: options.type,
		id: options.id
	});
};

const checkSpotify = (hits) => {
	return hits[0].result.primary_artist.name === 'Spotify' ? hits[1].result.url : hits[0].result.url;
};

const scrapeLyrics = async (path) => {
	const response = await fetch.get(path).catch(err => console.warn(err));
	console.log(response.body);
	const $ = cheerio.load(response.body);
	return [$('.header_with_cover_art-primary_info-title').text().trim(), $('.lyrics').text().trim()];
};

async function getStream(guildq, cb) {
	const video = guildq.queue[0];
	if(video.type === 'youtube') {
		const stream = await ytdl(`https://www.youtube.com/watch?v=${video.id}`, { filter: 'audioonly' });
		cb({ url: stream, options: { volume: guildq.volume, bitrate: 'auto', type: 'opus' } });
	} else if(video.type === 'soundcloud') {
		const stream = await fetch.get(`http://api.soundcloud.com/tracks/${video.id}/stream?consumer_key=${process.env.soundcloud}`);
		cb({ url: stream.url, options: { volume: guildq.volume, bitrate: 'auto' } });
	} else {
		youtubedl.getInfo(video.id, ['-q', '--no-warnings', '--force-ipv4'], function(err, data) {
			if (err) console.log(err);
			cb({ url: data.url, options: { volume: guildq.volume, bitrate: 'auto' } });
		});
	}
}