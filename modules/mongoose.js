const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uri = `mongodb+srv://ImmortalSnake:${process.env.PASS}@musiccraft-pp2oj.mongodb.net/test`;
mongoose.connect(uri, {
    useNewUrlParser: true,
    reconnectInterval: 500,
    reconnectTries: Number.MAX_VALUE,
    poolSize: 5,
    connectTimeoutMS: 10000,
    autoIndex: false
});
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

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
    client.inv = require('../models/player.js');
    client.guilddb = require('../models/guild.js');
    client.db = require('./db.js');
};