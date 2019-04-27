// lets save this for when the bot gets added to dbl
module.exports = (client, server) => {
  const DBL = require('dblapi.js');
  const dbl = new DBL(process.env.DBLTOKEN, { webhookServer: server, webhookAuth: 'authorkeplerbot' }, client);
}

