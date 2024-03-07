const mongoose = require('mongoose')
const Schema = mongoose.Schema; 
const bugDB = require('../Database/bugTracker')

const projectSchema = mongoose.Schema({
    name: String,
    details: String,
    priority: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        role: String, 
      },
    ],
    dateCreated: String,
    dateCompleted: String,
})

projectSchema.pre('save', function (next) {
    if (!this.dateCreated) {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        this.dateCreated = formattedDate; 
    }

    next()
})

const projectModel = bugDB.model('Project', projectSchema)

module.exports = projectModel