const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
	id: { type: String, required: true },
	tools: [],
	equipped: [],
	materials: [],
	food: [],
	crates: [],
	armor: [],
	other: [],
	cooldowns: [],
	trade: [],
	health: {type: Number, default: 100},
	attack: {type: Number, default: 10},
	speed: {type: Number, default: 10},
	xp: {type: Number, default: 0},
	level: {type: Number, default: 1},
	hunger: {type: Number, default: 100},
	lastactivity: {type: Number, default: 0},
	luck: {type: Number, default: 0},
	dimension: {type: String, default: 'Overworld'},
	money: {type: Number, default: 0}
});

module.exports = mongoose.model('Player', playerSchema);