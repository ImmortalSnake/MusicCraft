const discord = require('discord.js');
const config = process.env;
const client = new discord.Client();
const moment = require('moment');
const http = require('http');
const express = require('express');
const app = express();

app.get('/', (request, response) => {
  console.log(moment.utc(Date.now()).format('MM/DD/YYYY h:mm A') + ' Ping Received');
  // consoleHook.send(ms(, { long: true }) + ' Ping Received');
  response.sendStatus(200);
});

const port = app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
// lets save this for when the bot gets added to dbl
// const DBL = require('dblapi.js');
// const dbl = new DBL(process.env.DBLTOKEN, { webhookServer: server, webhookAuth: 'authorkeplerbot' }, bot);
require('./modules/main.js')(client);

client.login(config.token).catch(e => console.log(e));

process
  .on('uncaughtException', err => console.error(err.stack))
  .on('unhandledRejection', err => console.error(err.stack));