const utils = {
  owner: '410806297580011520',
  defaultQueue: {
    queue: [], // example {url: '',name: '',id: '', skippers: [], requestor}
    isPlaying: false,
    dispatcher: null,
    voiceChannel: null,
    looping: false,
    volume: 5, // default volume
  },
  settings: {
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
    },
  }
}

module.exports = utils;
