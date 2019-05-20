module.exports = (client) => {
	client.prefix = 's!';
	client.owner = '410806297580011520';
	client.id = '557831541653241857';
	client.config = {
		maintenance: false,
		dbl: false,
		blacklisted: [],
		admins: ['410806297580011520', '545983923340181514', '348192128599588864', '324080309547171840'],
		donators: [],
		version:'0.9.3',
		support: 'https://discord.gg/q2ZpFG4',
		invite: `https://discordapp.com/api/oauth2/authorize?client_id=${client.id}&permissions=8&scope=bot`,
		upvote: '',
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
				chop: {
					energy: -0.25,
					nether: false
				},
				explore: {
					energy: -5,
					nether: true
				},
				farm: {
					energy: -5,
					nether: false
				},
				fish: {
					energy: -5,
					nether: false
				},
				mine: {
					energy: -0.25,
					nether: true
				}
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