const db = require('quick.db');
const fetch = require('node-superfetch');

module.exports = (client) => class Minecraft {
	constructor(options) {

		this.inv = require('../models/player.js');
		this.Food = require('../assets/Inventory/Items/food');
		this.Materials = require('../assets/Inventory/Items/materials');
		this.Tools = require('../assets/Inventory/Tools/tools');
		this.Armor = require('../assets/Inventory/Tools/armor');
		this.Other = require('../assets/Inventory/Tools/other');
		this.mobs = require('../assets/Game/mobs');
		this.shop = require('../assets/Game/shop');
		this.recipes = require('../assets/Game/recipes');
		this.crates = require('../assets/Game/crates');
		this.exploreTimer = options.exploreTimer;
		this.rhunger = options.rhunger;
		this.villageTimer = options.villageTimer;
		this.codes = options.codes;
		this.commands = options.commands;
		this.dailyEnergy = options.dailyEnergy;
		this.client = client;

	}

	async set(data, val) {
		val.forEach(v => data.markModified(v));
		await data.save().catch(err => console.log(err));
	}

	async get(id) {
		const inv = await this.inv.findOne({ id: id });
		if(inv) return inv;
		else return false;
	}

	async checkInventory(user) {
		const inv = await this.get(user.id);
		const inventory = inv.inventory;
		if(!inventory) return { err: true };
		const def = this.defaultInventory;
		const keys = Object.keys(def);
		const values = Object.values(def);
		for(let i = 0; i < keys.length; i++) {
			if(!inventory[keys[i]]) {
				inventory[keys[i]] = values[i];
			}
			if(typeof values[i] !== typeof inventory[keys[i]]) {
				console.log(keys[i]);
			}
		}
		for(const t in inventory.tools) { if(!inventory.tools[t]) delete inventory.tools[t]; }
		for(const f in inventory.food) { if(!inventory.food[f]) delete inventory.food[f]; }
		return inv;
	}

	async create(id, actual) {
		try {
			const data = new this.inv({
				id: id,
				tools: actual ? this.convert(actual.tools) : [{ name: 'Wooden Axe', value: { durability: 60, Enchants: '' } }],
				equipped: actual ? this.convert(actual.equipped) : [{ name: 'axe', value: 'Wooden Axe' }],
				materials: actual ? this.convert(actual.materials) : [
					{ name: 'Wood', value: 0 },
					{ name: 'Stone', value: 0 },
					{ name: 'Dirt', value: 0 },
					{ name: 'Iron', value: 0 },
					{ name: 'Gold', value: 0 },
					{ name: 'Diamond', value: 0 }],
				armor: actual ? this.convert(actual.armor) : [],
				crates: [],
				food: actual ? this.convert(actual.food) : [],
				dimension: actual ? actual.dimension : 'Overworld',
				other: actual ? this.convert(actual.other) : [],
				money: await db.fetch(`balance_${id}`) || 0
			});
			data.save();
		} catch(err) {
			console.log(err);
			return 'Failed to Create A Character';
		}
	}

	async level(inventory, channel) {
		const lvl = inventory.level;
		const nextlvl = 5 * (lvl ** 2) + 50 * lvl + 100;
		if(nextlvl <= lvl) {
			inventory.level++;
			// await db.set(`inventory_${user.id}`, inventory);
			channel.send(`Level Up! You are now in level **${inventory.level}**`);
		}
	}

	convert(data) {
		const arr = [];
		for(const k in data) {
			const temp = { name: k, value: data[k] };
			arr.push(temp);
		}
		return arr;
	}

	find(name) {
		if(this.Tools[name]) return { name: 'tools', value: this.Tools[name] };
		if(this.Food[name]) return { name: 'food', value: this.Food[name] };
		if(this.Materials[name]) return { name: 'materials', value: this.Materials[name] };
		if(this.Armor[name]) return { name: 'armor', value: this.Armor[name] };
		if(this.Other[name]) return { name: 'other', value: this.Other[name] };
		return false;
	}

	ishow(inventory, type) {
		const res = {};
		let m = '**';
		inventory[type.toLowerCase()].forEach(mat => {
			res[mat.name] = mat.value || 0;
		});
		for(const v in res) {
			let e;
			if(this[type]) e = this[type][v] ;
			if(!e) e = { emote: '' };
			let x = `x${res[v]}\n`;
			if(type === 'Tools' || type === 'Armor') x = ` | Durability ${res[v].durability}\n`;
			else if(typeof res[v] === 'object') x = 'x1\n';
			m += `${v}${e.emote} ${x}`;
		}
		m += '**';
		return m;
	}

	async getCode(query) {
		const codes = await fetch.get(this.codes);
		const code = codes.body[query];
		return code;
	}

	icheck(inv, item) {
		for(const mat in item.materials) {
			const m = inv.materials.find(x=>x.name === mat.toProperCase());
			const f = inv.food.find(x=>x.name === mat.toProperCase());
			const o = inv.other.find(x=>x.name === mat.toProperCase());
			if(m && item.materials[mat] > m.value) return false;
			if(f && item.materials[mat] > f.value) return false;
			if(o && item.materials[mat] > o.value) return false;
		}
		if(item.other) {
			for(const oth in item.other) {
				const o = inv.other.find(x=> x.name === oth.toProperCase());
				if(o && item.materials[oth] > o.value) return false;
			}
		}
		return true;
	}
	async reset(id) {
		this.inv.findOneAndDelete({ id: id })
			.then(() => console.log(`${id} was successfully remove from the database`));
	}

	activity(inv, cmd, msg, { prefix }) {
		const command = this.commands[cmd.help.name];
		if(!command) return console.error(`${cmd.help.name} isnt registered in the config.js file`);

		if(inv.dimension === 'Nether' && !command.nether) return msg.channel.send(`You cant use this command in the Nether!
		 Use \`${prefix}dim overworld\` to go back to the overworld`);
		if(inv.hunger <= 5) {
			msg.channel.send(`You are too hungry. Use \`${prefix}cook [item]\` to cook food and get more energy and health.
			 Use \`${prefix}eat [item]\` to eat food or wait until your hunger reaches back to 100`);
			return false;
		}
		if(Date.now() - inv.lastactivity >= this.rhunger && inv.hunger < 75) inv.hunger += this.dailyEnergy;
		if(inv.hunger % 2 === 0 && inv.hunger <= 25) {
			msg.channel.send(`You are getting hungry. To get food use \`${prefix}craft wooden hoe\` to craft a hoe and \`${prefix}farm\` to get food.
			 Use \`${prefix}cook [item]\` to cook food and get more energy and health. Use \`${prefix}eat [item]\` to eat food`);
			return false;
		}
		inv.hunger += command.energy;
		inv.lastactivity = Date.now();
		return inv;
	}

	iadd(inv, { name, value, locate }) {
		const a = inv[locate].find(f=> f.name === name);
		a ? a.value++ : inv[locate].push({ name: name, value: value });
		return inv;
	}
};