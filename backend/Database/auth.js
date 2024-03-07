require('dotenv').config()
const mongoose = require('mongoose');

//connection to auth db
const authDB = mongoose.createConnection(process.env.AUTH_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


module.exports = authDB;