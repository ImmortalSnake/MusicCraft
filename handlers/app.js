const moment = require('moment');
const http = require('http');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
app.get('/', (request, response) => {
	console.log(moment.utc(Date.now()).format('MM/DD/YYYY h:mm A') + ' Ping Received');
	response.sendStatus(200);
});

const port = app.listen(process.env.PORT);
setInterval(() => {
	http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

process
	.on('uncaughtException', err => console.error(err.stack))
	.on('unhandledRejection', err => console.error(err.stack));

module.exports = client => {
	if(client.config.dbl) require('./dbl.js')(client, server);
};