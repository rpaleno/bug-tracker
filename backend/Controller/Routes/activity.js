require('dotenv').config()
const route = require('express').Router()
const jwt = require('jsonwebtoken')
const activityModel = require('../../Models/activityModel')
const authenticateToken = require('./Middleware/authenticate');


//create new activity
route.post('/create', authenticateToken, async(req,res) => {
    try {
        const activityObject = req.body
        activityObject.user = req.name
        activityModel.create(activityObject)
        res.send(activityObject)
    } catch(err) {
        res.status(400).send(err);
    }
})

//fetch project activity
route.get('/', authenticateToken, async(req,res) => {
    try {
        const id = req.query.id
        const activity = await activityModel.find({project: id}).populate('project').sort({ createdAt: -1});
        res.send(activity)
    } catch(err) {
        res.status(400).send(err)
    }
})

//delete activity
route.delete('/delete', async(req,res) => {
    try {
        const {_id} = req.body
        const deletedActivity = await activityModel.findByIdAndDelete(_id)
        res.send(deletedActivity)
    } catch(err) {
        res.status(400).send(err)
    }
})

module.exports = route