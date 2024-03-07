const mongoose = require('mongoose')
const authDB = require('../Database/auth')

const userSchema = mongoose.Schema({
    email: String,
    name:String,
    password:String,
    token: String
})

const userModel = authDB.model('User',userSchema)

module.exports = userModel
