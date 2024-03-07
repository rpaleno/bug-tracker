const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bugDB = require('../Database/bugTracker');

const inviteSchema = mongoose.Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project', //reference to the project model
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
    role: String,
    dateCreated: String,
})

inviteSchema.pre('save', function (next) {
    if (!this.dateCreated) {
        //set the dateStarted only if it's not already provided
        const currentDate = new Date();
        const formattedDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        this.dateCreated = formattedDate;
        this.status = 'pending'
    }

    next()

    next()
})


const inviteModel = bugDB.model('Invite', inviteSchema);

module.exports = inviteModel

