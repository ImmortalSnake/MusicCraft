module.exports = (client) => {
  client.prefix = 's!';
  client.version = '0.9.95';
  client.owner = '410806297580011520';
  client.id = '557831541653241857'
	client.admins = ['410806297580011520', '545983923340181514', '348192128599588864', '324080309547171840'];
  client.donators = [];
	client.blacklisted = [];
  client.config = {
    maintainence: false,
    dbl: false,
    support: 'https://discord.gg/q2ZpFG4',
    invite: `https://discordapp.com/api/oauth2/authorize?client_id=${client.id}&permissions=8&scope=bot`,
    upvote: ''
  }
};