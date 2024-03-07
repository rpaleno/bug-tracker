const mongoose = require('mongoose')
const Schema = mongoose.Schema; //define Schema
const bugDB = require('../Database/bugTracker')
const Project = require('./projectModel'); //import the Project schema

const activitySchema = mongoose.Schema({
    name: String,
    details: String,
    user: String,
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project', //reference to the project model
        required: true,
    },
    date: String,
    createdAt: {type: Date, default: Date.now}
});

//set TTL index to expire documents after 7 days
activitySchema.index({ "createdAt": 1 }, { expireAfterSeconds: 60*60*24*7 });
const ActivityModel = bugDB.model('Activity', activitySchema);

module.exports = ActivityModel;