const commando = require('discord.js-commando');
const Discord = require('discord.js');
const getArtistTitle = require('get-artist-title');
const axios = require('axios');
const cheerio = require('cheerio');
const settings = process.env
const baseURL = `https://api.genius.com/search?access_token=${settings.GENIUS}`;

module.exports = class PauseCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'lyrics',
            group: 'music',
            memberName: 'lyrics',
            description: 'Pauses the music for ya',
            guildOnly: true,
            format: '[song]'
        });
    }

    async run(message, args) {
if(!args && !global.guilds[message.guild.id]) return;
let find = args || global.guilds[message.guild.id].queue[0].title
const query = createQuery(find);
searchLyrics(`${baseURL}&q=${encodeURIComponent(query)}`)
  .then(songData => {
    const embed = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setTitle(`Lyrics for: ${songData[0]}`)
      //.setDescription(songData[1]);
    message.channel.send(':mag_right:**Searching lyrics for** `' + query + '`').then(() => {
    setTimeout(() => {
    message.channel.send('Lyrics for ' + songData[0] + '\n\n' + songData[1], { split: true, code: true });
  }, 500)
  })
  })
  .catch(err => {
    message.channel.send(`No lyrics found for: ${query} 🙁`, {code:'asciidoc'});
    console.warn(err);
  });
  }
};

const scrapeLyrics = path => {
  return axios.get(path)
    .then(response => {
      let $ = cheerio.load(response.data);
      return [$('.header_with_cover_art-primary_info-title').text().trim(), $('.lyrics').text().trim()];
    })
    .catch(err => {
      console.warn(err);
    });
};

const searchLyrics = url => {
  return Promise.resolve(axios.get(url, {'Authorization': `Bearer ${settings.GENIUS}`})
    .then(response => checkSpotify(response.data.response.hits))
    .then(path => scrapeLyrics(path))
    .catch(err => {
      console.warn(err);
    })
  );
};

const checkSpotify = hits => {
  return hits[0].result.primary_artist.name === 'Spotify' ? hits[1].result.url : hits[0].result.url;
};

const createQuery = arg => {
  if (arg === 'np') {
    const query = [ artist, title ] = getArtistTitle(playlist.current, {
      defaultArtist: ' '
    });
    console.log(query)
    return query.join(' ')
  } else return arg;
};
