const discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const fetch = require("node-fetch");
const db = require('quick.db');
const sort = require('array-sort');

module.exports = (client) => {

client.playMusic= async function(id, message, soundcloud) {
try{
  const guildq = global.guilds[message.guild.id];
    global.guilds[message.guild.id].voiceChannel = message.member.voice.channel;
    global.guilds[message.guild.id].voiceChannel.join().then(async function(connection) {
      if(!soundcloud) guildq.dispatcher = await connection.play(await ytdl('https://www.youtube.com/watch?v=' + id, { filter: 'audioonly'}), { volume: guildq.volume, bitrate: 'auto', type: 'opus' });
      else {
        let stream = await fetch("http://api.soundcloud.com/tracks/" + id + "/stream?consumer_key=71dfa98f05fa01cb3ded3265b9672aaf")
        console.log(stream.url)
        guildq.dispatcher = await connection.play(stream.url,  { volume: guildq.volume, bitrate: 'auto' });
      }
        guildq.skippers = [];
        guildq.dispatcher.on('end', function() {
            guildq.skippers = [];
            if(guildq.looping) {
                return client.playMusic(id, message);
            }
          else {
                guildq.queue.shift();
            }
            if (guildq.queue.length === 0) {
                guildq.queue = [];
                guildq.isPlaying = false;
                message.guild.voiceConnection.disconnect();
                message.channel.send('Music finished. Leaving the Voice Channel..');
            }
          else { // queue here
                setTimeout(function() { 
                    client.playMusic(guildq.queue[0].id, message, guildq.queue[0].soundcloud);
                }, 500);
            }
        });
    });
  } catch(err){ // risky boi
console.log(err);
}
}

client.error= async function(bot, error, message){ // error handler

}
  
client.getTime= function(v) {
  let m = ''
  if(v>=60){ 
  m+= Math.floor(v/60);
   v = v - m*60
  }
  m = m ? m : '00';
  m = (m>10) ? m :(m != '00' ? '0' + m : m)
  v = (v>10) ? v : ('0' + v)
  m = m +':' +v;
return m;
}

client.loadCommand = (commandName) => {
    try {
      console.log(`Loading Command: ${commandName}`);
      let command = client.commands.get(commandName);
      let group = command.help.group
      const props = require(`../commands/${group}/${commandName}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
};

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
  
    if (command.shutdown) await command.shutdown(client);
    let group = command.help.group
    const mod = require.cache[require.resolve(`../commands/${group}/${commandName}`)];
    delete require.cache[require.resolve(`../commands/${group}/${commandName}.js`)];
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
    return false;
};
  
Object.defineProperty(String.prototype, "toProperCase", {
    value: function() {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
});
  
Object.defineProperty(Array.prototype, "random", {
    value: function() {
      return this[Math.floor(Math.random() * this.length)];
    }
});
  
  client.wait = require("util").promisify(setTimeout);

  client.throttle = async function() {
  
  }
  
  client.formatError = async function(client, message) {
    message.channel.send('Incorrect Format')
  }
  client.dbSort = function(val) {
   let sorted = sort(db.all(), 'data', { reverse: true }).filter(a=>a.ID.startsWith(val))
   return sorted
  }
  client.checkInventory = async function(user) {
    let inventory = await db.fetch(`inventory_${user.id}`)
    let def = client.defaultInventory
    let keys = Object.keys(def)
    let values = Object.values(def)
    for(let i =0; i<keys.length; i++) {
      if(!inventory[keys[i]]) {
        inventory[keys[i]] = values[i]
      }
      if(typeof values[i] !== typeof inventory[keys[i]]) {
        console.log(keys[i])
      }
    }
    for(const t in inventory.tools) { if(!inventory.tools[t]) delete inventory.tools[t] }
    for(const f in inventory.food) { if(!inventory.food[f]) delete inventory.food[f] }
    await db.set(`inventory_${user.id}`, inventory)
    return inventory
  }
  client.level = async function(inventory, channel, user){
    let curlvl = Math.floor(0.5 * Math.sqrt(inventory.xp));
    if(inventory.level < curlvl) {
      inventory.level++
      await db.set(`inventory_${user.id}`, inventory)
      channel.send(`Level Up! You are now in level **${inventory.level}**`)
    }
  }
  client.embed = function (message, options) {
    let color = options ? options.color ? options.color : '#206694' : '#206694'
    let embed = new discord.MessageEmbed()
    .setColor(color)
    .setFooter(message.author.username, message.author.displayAvatarURL())
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    if(options && options.title) embed.setTitle(options.title)
    return embed
  }
}

const ffmpegArguments = [
  '-analyzeduration', '0',
  '-loglevel', '0',
  '-f', 's16le',
  '-ar', '48000',
  '-ac', '2',
];

function playStream(stream, options) {
    this.opusEncoder = require('./NodeOpusEngine');
    const transcoder = this.prism.transcode({
      type: 'ffmpeg',
      media: stream,
      ffmpegArguments: ffmpegArguments.concat(['-ss', String(options.seek || 0)]),
    });
    this.destroyCurrentStream();
    this.currentStream = {
      transcoder: transcoder,
      output: transcoder.output,
      input: stream,
    };
    transcoder.on('error', e => {
      this.destroyCurrentStream();
      if (this.listenerCount('error') > 0) this.emit('error', e);
      this.emit('warn', `prism transcoder error - ${e}`);
    });
    return this.playPCMStream(transcoder.output, options, true);
}

  function playPCMStream(stream, options = {}, fromUnknown = false) {
    this.destroy();
    this.opusEncoder = require('./NodeOpusEngine'),
    this.setBitrate(options.bitrate);
    const dispatcher = this.createDispatcher(stream, options);
    if (fromUnknown) {
      this.currentStream.dispatcher = dispatcher;
    } else {
      this.destroyCurrentStream();
      this.currentStream = {
        dispatcher,
        input: stream,
        output: stream,
      };
    }
    return dispatcher;
  }