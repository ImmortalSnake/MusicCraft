const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    id: String,
    prefix: String,
    djrole: String,
    musicchannel: String,
    defvolume: 5,
    announcesongs: 'off'
});

module.exports = mongoose.model('Guild', guildSchema);