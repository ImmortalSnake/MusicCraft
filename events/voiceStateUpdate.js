module.exports = (client, oldstate, newstate) => {
  if(oldstate.member.user.bot) return;
  let guildq = global.guilds[oldstate.guild.id];
  if(guildq && guildq.queue.length > 0) {
    if(oldstate.voice.channel.id === guildq.voiceChannel.id){}
  }
}