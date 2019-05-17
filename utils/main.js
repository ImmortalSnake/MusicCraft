module.exports = (client) => {
  client.tools = require('../assets/tools');
	client.items = require('../assets/items');
	client.shop = require('../assets/shop');
	client.perms = require('./permissions.js');
	client.time = require('./time.js');

	client.deftrade = {
		user: '',
		recieved: {},
		give: {}
	};
	client.settings = {
		announceSongs: {
			description: 'Toggles the bot announcing each song in the channel as it plays them',
			name: 'Announce Songs',
			usage: 'announcesongs [on / off]',
			value: 'announcesongs'
		},
		DJRole: {
			description: 'Sets a Dj Role. Any member with the DJ Role has access to most of the music commands',
			name: 'DJ Role',
			usage: 'djrole [@role] or djrole off',
			value: 'djrole',
			type: 'role'
		},
		prefix: {
			description: 'Changes the prefix for the guild!',
			name: 'Prefix',
			usage: 'prefix [new prefix]',
			value: 'prefix'
		},
		defVolume: {
			description: 'Sets the default volume for the guild!',
			name: 'Default Volume',
			usage: 'defvolume [Volume (in numbers)]',
			value: 'defvolume'
		},
		musicChannel: {
			description: 'Restricts all musics commands to be used in a certain channel',
			name: 'Music Channel',
			usage: 'musicchannel [#textchannel] or musicchannel off',
			value: 'musicchannel',
			type: 'channel'
		}
	};

	client.utils = {
		exploreTimer: 3600 * 1000,
		rhunger: 86400000,
		villageTime: 10800000,
	};
};
