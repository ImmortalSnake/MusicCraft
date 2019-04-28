module.exports = (client) => {
  client.tools = require('../assets/tools');
  client.items = require('../assets/items');
  client.mobs = require('../assets/mobs');
  client.shop = require('../assets/shop');
  client.owner = '410806297580011520';
  client.admins = ['410806297580011520', '545983923340181514', '348192128599588864', '324080309547171840'];
  client.defaultQueue= {
    queue: [], // example {url: '',name: '',id: '', skippers: [], requestor}
    isPlaying: false,
    dispatcher: null,
    voiceChannel: null,
    looping: false,
    volume: 5, // default volume
  };
  client.defaultInventory = {
    health: 100,
    attack: 10,
    speed: 10,
    luck: 0,
    dimension: 'Overworld',
    xp: 0,
    level: 1,
    hunger: 100,
    lastactivity: 0,
    size: 100,
    equipped: {
      axe: 'Wooden Axe'
    },
    tools: {
      'Wooden Axe': {
        durability: 60,
        enchant: ''
      }
    },
    materials: {
      'Wood': 0,
      'Stone': 0,
      'Dirt': 0,
      'Iron': 0,
      'Gold': 0,
      'Diamond': 0
    },
    food: {},
    crates: [],
    animals: {},
    armor: {},
    other: {},
    trade: {}
  };
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
      value: 'announceSongs'
    },
    DJRole: {
      description: 'Sets a Dj Role. Any member with the DJ Role has access to most of the music commands',
      name: 'DJ Role',
      usage: 'djrole [@role]',
      value: 'djRole',
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
      value: 'defVolume'
    },
    musicChannel: {
      description: 'Restricts all musics commands to be used in a certain channel',
      name: 'Music Channel',
      usage: 'musicchannel [#textchannel]',
      value: 'musicChannel',
      type: 'channel'
    }
  };
  client.defSettings = {
    prefix: 's!',
    djRole: '',
    defVolume: 5,
    announceSongs: 'off',
    musicChannel: ''
  };
  client.utils = {
    heads: client.emojis.find(emoji => emoji.name === 'heads'),
    tails: client.emojis.find(emoji => emoji.name === 'tails'),
    dailyTimer: 70000000,
    daily: 100,
    Streak: 5,
    dailystreak: 250,
    defaultBal: 0,
    work: [10, 1], // max and minimum note: maximum is the sum of both. so in this case it will be
    rob: [50, 0], // dont rob lul
    fine: [50, 25],
    exploreTimer: 3600 * 1000,
    rhunger: 86400000,
    villageTime: 10800000,
    cooldown: {
      work: 5 * 1000,
      rob: 5 * 60 * 1000
    }
  };
};
