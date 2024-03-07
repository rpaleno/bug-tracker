const mongoose = require('mongoose')
const authDB = require('../Database/auth')

const tokenSchema = mongoose.Schema({
    username:String,
    token:String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60
    }

})

const refreshToken = authDB.model('Refresh-Token', tokenSchema)

module.exports = refreshToken
