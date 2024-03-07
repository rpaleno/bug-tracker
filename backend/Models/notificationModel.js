const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bugDB = require('../Database/bugTracker')

const notificationSchema = Schema({
    type: String,
    details: String,
    user: String,
    date: String,
    time: String,
})

const notificationModel = bugDB.model('Notification', notificationSchema)

module.exports = notificationModel