const mongoose = require('mongoose');
const { mongodb } = require('../config');
mongoose.Promise = global.Promise;
mongoose.connect(mongodb.uri, mongodb.options);
mongoose.set('useFindAndModify', false);
mongoose.Promise = Promise;

const conn = mongoose.connection;

conn.on('error', () => console.error(console, 'connection error:'));

conn.on('connected', () => {
	console.log('Connected to MongoDB');
});

conn.on('disconnected', () => {
	console.log('Disconnected from MongoDB');
});

conn.on('reconnected', () => {
	console.log('Reconnected to MongoDB');
});

module.exports = (client) => {
	client.guilddb = require('../models/guild.js');
};