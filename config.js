module.exports = (client) => {
	client.prefix = 's!';
	client.version = '0.9.98';
	client.owner = '410806297580011520';
	client.id = '557831541653241857';
	client.admins = ['410806297580011520', '545983923340181514', '348192128599588864', '324080309547171840'];
	client.donators = [];
	client.blacklisted = [];
	client.config = {
		maintenance: false,
		dbl: false,
		support: 'https://discord.gg/q2ZpFG4',
		invite: `https://discordapp.com/api/oauth2/authorize?client_id=${client.id}&permissions=8&scope=bot`,
		upvote: '',
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
      codes: process.env.codes
    }
	};
};

module.exports.options = {
	disableEveryone: true,
	messageCacheLifetime: 3600,
	messageSweepInterval: 3600,
	autoReconnect: true
};