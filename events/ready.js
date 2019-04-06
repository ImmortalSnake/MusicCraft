const db = require('quick.db')

exports.run = async (client) => {
  console.log(client.user.username + ' Has Turned On Successfuly');
  client.villager()
}