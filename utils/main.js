module.exports = (client) => {
	Object.defineProperty(String.prototype, 'toProperCase', {
		value: function() {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		}
	});

	Object.defineProperty(Array.prototype, 'random', {
		value: function() {
			return this[Math.floor(Math.random() * this.length)];
		}
	});

	client.perms = require('./permissions.js');
	client.time = require('./time.js');
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
};
