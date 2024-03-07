require('dotenv').config()
const mongoose = require('mongoose');

//connection to bug db
const bugDB = mongoose.createConnection(process.env.BUG_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

module.exports = bugDB;