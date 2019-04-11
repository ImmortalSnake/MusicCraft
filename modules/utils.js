module.exports = (client) => {
  client.tools = require('../assets/tools')
  client.items = require('../assets/items')
  client.mobs = require('../assets/mobs')
  client.owner = '410806297580011520'
  client.admins = ['410806297580011520', '545983923340181514', '348192128599588864', '324080309547171840']
  client.defaultQueue= {
    queue: [], // example {url: '',name: '',id: '', skippers: [], requestor}
    isPlaying: false,
    dispatcher: null,
    voiceChannel: null,
    looping: false,
    volume: 5, // default volume
  }
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
      axe: "Wooden Axe",
      pickaxe: '',
      sword: '',
      hoe: ''
    },
    tools: {
      "Wooden Axe": 1,
    },
    materials: {
      "Wood": 0,
      "Stone": 0,
      "Dirt": 0,
      "Iron": 0,
      "Gold": 0,
      "Diamond": 0
    },
    food: {},
    crates: [],
    animals: {},
    armor: {},
    other: {},
    trade: {}
  }
  client.deftrade = {
    user: '',
    recieved: {},
    give: {}
  }
  client.settings = {
    announcesongs: {
      value: false, // default values
      options: ['on', 'off'], // options choose these for easy settings
      description: 'Toggles the bot announcing each song as it plays them.' // description
    },
    maxqueuelength: {
      value: 'disabled',
      options: ['number', 'disabled'],
      description: 'Limits how many songs the queue can hold at one time, can be disabled by typing *disable* instead of a number.'
    },
    DJRole: {
      value: 'DJ',
      options: ['role'],
      description: 'Changes which role is considered DJ.'
    },
    Prefix: {
      value: 's!',
      options: ['text'],
      description: 'Changes the prefix used to address Rythm bot.'
    }
  }
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
    exploreTimer: 3600 * 1,
    rhunger: 86400000,
    villageTime: 10800000,
    cooldown: {
      work: 5 * 1000,
      rob: 5 * 60 * 1000
    }
  }
}
