const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bugDB = require('../Database/bugTracker')

const bugSchema = mongoose.Schema({
    name:String,
    details:String,
    steps:String,
    version:String,
    priority:String,
    assigned: { type: Schema.Types.ObjectId, ref: 'User' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    project:  { type: Schema.Types.ObjectId, ref: 'Project' },
    dateCreated:String,
    dateCompleted:String,
})

bugSchema.pre('save', function (next) {
    if (!this.dateCreated) {
        //set the dateStarted only if it's not already provided
        const currentDate = new Date();
        const formattedDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        this.dateCreated = formattedDate;
    }

    next()
})

const bugModel = bugDB.model('Bug', bugSchema)

module.exports = bugModel