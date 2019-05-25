module.exports = class Utils {
	constructor(options) {
		this.options = options;
		this.wait = require('util').promisify(setTimeout);
		this.tips = require('../assets/tips');
	}

	clean(text) {
		if(typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
		else return text;
	}

	formatError(command, message) {
		console.log(command);
		message.channel.send('Incorrect Format');
	}

	comma(num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	}
};