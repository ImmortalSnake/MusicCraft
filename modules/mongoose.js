const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uri = `mongodb+srv://ImmortalSnake:${process.env.PASS}@musiccraft-pp2oj.mongodb.net/test`;
mongoose.connect(uri, { useNewUrlParser: true });
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
  console.log('Connected to MongoDB');
  // we're connected!
});
