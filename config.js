// All Main Configuration for the bot

module.exports = (client) => {
	client.prefix = 's!';
	client.owner = '410806297580011520';
	client.id = '557831541653241857';
	client.config = {
		maintenance: false,
		offline: false,
		dbl: false,
		blacklisted: [],
		consoleChannel: '545708932807655444',
		admins: ['410806297580011520', '545983923340181514', '348192128599588864', '324080309547171840'],
		donators: [],
		version:'1.0.0',
		support: 'https://discord.gg/q2ZpFG4',
		invite: `https://discordapp.com/api/oauth2/authorize?client_id=${client.id}&permissions=8&scope=bot`,
		upvoteURL: '',
		website: 'https://immortalsnake.gitbook.io/music-craft/',
		github: 'https://github.com/ImmortalSnake/MusicCraft',
		embedColor: '#206694',
		mentionPrefix: true,
		music: {
			defaultVolume: 5,
			yt_api_key: process.env.yt_api_key,
			wait: 500,
			genius_key: process.env.GENIUS,
			soundcloud_key: process.env.soundcloud,
			bitrate: 'auto'
		},
		minecraft: {
			exploreTimer: 3600 * 1000,
			rhunger: 86400000,
			villageTimer: 10800000,
			codes: process.env.codes,
			dailyEnergy: 25,
			commands: {
				chop: { energy: -0.25, nether: false },
				explore: { energy: -5, nether: true },
				farm: { energy: -5, nether: false },
				fish: { energy: -5, nether: false },
				mine: { energy: -0.25, nether: true }
			}
		}
	};
};

module.exports.options = {
	disableEveryone: true,
	messageCacheLifetime: 3600,
	messageSweepInterval: 3600,
	autoReconnect: true
};

module.exports.mongodb = {
	uri: `mongodb+srv://ImmortalSnake:${process.env.PASS}@musiccraft-pp2oj.mongodb.net/test`,
	options: {
		useNewUrlParser: true,
		reconnectInterval: 500,
		reconnectTries: Number.MAX_VALUE,
		poolSize: 5,
		connectTimeoutMS: 10000,
		autoIndex: false
	}
};