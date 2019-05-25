const youtubedl = require('youtube-dl');
const ytdl = require('ytdl-core-discord');
const fetch = require('node-superfetch');
const cheerio = require('cheerio');
const YouTube = require('simple-youtube-api');

module.exports = (client) => class Music {
	constructor(options) {

		this.yt = new YouTube(options.yt_api_key);
		this.wait = options.wait;
		this.lyricsURL = `https://api.genius.com/search?access_token=${options.genius_key}`;
		this.soundloud_key = options.soundloud_key;
		this.bitrate = options.bitrate;
		this.queue = global.guilds;
		this.defaultQueue = {
			queue: [],
			isPlaying: false,
			dispatcher: null,
			voiceChannel: null,
			looping: false,
			volume: options.defaultVolume,
		};

	}
	async play(message, settings) {
		try {
			const guildq = global.guilds[message.guild.id];
			guildq.voiceChannel = message.member.voice.channel;
			guildq.voiceChannel.join().then(async function(connection) {
				client.music.getStream(guildq, stream => {
					guildq.dispatcher = connection.play(stream.url, stream.options);
					guildq.isPlaying = true;
					if(settings.announcesongs === 'on') message.channel.send(`**:musical_note: Now playing** \`${guildq.queue[0].title}\``);
					guildq.skippers = [];
					guildq.dispatcher.on('end', function() {
						guildq.skippers = [];
						if(guildq.looping) return client.music.play(message, settings);
						else guildq.queue.shift();
						if (guildq.queue.length === 0) {
							guildq.queue = [];
							guildq.isPlaying = false;
							guildq.voiceChannel.disconnect();
							return message.channel.send('Music finished, Leaving the Voice Channel');
						} else {
							setTimeout(function() {
								client.music.play(message, settings);
							}, this.wait);
						}
					});
				});
			});
		} catch(err) {
			console.error(err);
			message.channel.send('An error occurred. Please try again later');
			return global.guilds[message.guild.id].queue = [];
		}
	}

	newMethod() {
		return this;
	}

	async lyrics(query) {
		const url = `${this.lyricsURL}&q=${encodeURIComponent(query)}`;
		const response = await fetch.get(url).catch(err => console.warn(err));
		const path = this.checkSpotify(response.body.response.hits);
		const lyrics = await this.scrapeLyrics(path);
		return lyrics;
	}

	check(message, settings, options) {
		let guildq = global.guilds[message.guild.id];
		if (!guildq) {
			guildq = global.guilds[message.guild.id] = this.defaultQueue;
			guildq.volume = settings.defvolume;
		}
		if(settings.musicchannel && !message.guild.channels.get(settings.musicchannel)) settings.musicchannel = '';
		if(settings.djrole && !message.guild.roles.get(settings.djrole)) settings.djrole = '';
		const res = [
			`Sorry, only members with the **DJ Role** \`${message.guild.roles.get(settings.djrole) ? message.guild.roles.get(settings.djrole).name : ''}\` can use this command`,
			`Sorry, all music commands can be used only in **${message.guild.channels.get(settings.musicchannel)}**`,
			'You need to be in a voice channel to use this command!',
			'Currently playing something in another voice channel',
			'There is nothing playing'
		];
		if(settings.musicchannel && message.channel.id !== settings.musicchannel) return res[1];
		if(options.vc && !message.member.voice.channel) return res[2];
		if(guildq.isPlaying && guildq.voiceChannel !== message.member.voice.channel) return res[3];
		if (options.playing && !guildq.queue[0]) return res[4];
		if(settings.djrole && options.djrole && !message.member.roles.has(settings.djrole) && !message.member.hasPermission('ADMINISTRATOR')) {
			if(options.vc && message.member.voice.channel.members.size > 2) return res[0];
			else if(!options.vc) return res[0];
		}

		return false;
	}

	add(data, message, options) {
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
	}

	async getStream(guildq, cb) {
		const video = guildq.queue[0];
		if(video.type === 'youtube') {
			const stream = await ytdl(`https://www.youtube.com/watch?v=${video.id}`, { filter: 'audioonly' });
			cb({ url: stream, options: { volume: guildq.volume, bitrate: this.bitrate, type: 'opus' } });
		} else if(video.type === 'soundcloud') {
			const stream = await fetch.get(`http://api.soundcloud.com/tracks/${video.id}/stream?consumer_key=${this.soundcloud_key}`);
			cb({ url: stream.url, options: { volume: guildq.volume, bitrate: this.bitrate } });
		} else {
			youtubedl.getInfo(video.id, ['-q', '--no-warnings', '--force-ipv4'], function(err, data) {
				if (err) console.log(err);
				cb({ url: data.url, options: { volume: guildq.volume, bitrate: this.bitrate } });
			});
		}
	}

	checkSpotify(hits) {
		return hits[0].result.primary_artist.name === 'Spotify' ? hits[1].result.url : hits[0].result.url;
	}
	async scrapeLyrics(path) {
		const response = await fetch.get(path).catch(err => console.warn(err));
		console.log(response.body);
		const $ = cheerio.load(response.body);
		return [$('.header_with_cover_art-primary_info-title').text().trim(), $('.lyrics').text().trim()];
	}

	removedupes(queue) {
		const nq = [];
		queue.forEach(e => {
			if(!nq.includes(e)) nq.push(e);
		});
		return nq;
	}
};
