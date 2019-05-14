const db = require('quick.db');

module.exports = (client) => {
	client.villager = async () => {
		const villageTime = client.utils.villageTime;
		let villager = await db.fetch('villager');
		if(!villager || villager.time + villageTime < Date.now()) await generate(client);
		villager = await db.fetch('villager');
		const tleft = villager.time + villageTime - Date.now();
		setTimeout(async () => {
			await generate();
     	return client.villager();
		}, tleft);
	};
};

async function generate() {
	const n = {
		time: Date.now(),
		store: {
			'Wood': [rand(100, 50), 1],
			'Coal': [rand(80, 50), 1],
			'Stone': [rand(120, 80), 1],
			'Dirt': [rand(250, 150), 1],
			'Iron': [rand(50, 20), 1],
			'Redstone': [rand(6, 2), 1],
			'Lapis': [rand(6, 2), 1],
			'Gold': [1, rand(2, 1)],
			'Diamond': [1, rand(4, 2)]
		}
	};
	console.log('Generating villager');
	await db.set('villager', n);
}

function rand(num1, num2) {
	return Math.floor(Math.random() * num1) + num2;
}