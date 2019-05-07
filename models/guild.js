const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
	id: String,
	prefix: String,
	djrole: String,
	musicchannel: String,
	defvolume: Number,
	announcesongs: String
});

module.exports = mongoose.model('Guild', guildSchema);