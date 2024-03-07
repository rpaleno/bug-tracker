const route = require('express').Router()
const notificationModel = require('../../Models/notificationModel')
const authenticateToken = require('./Middleware/authenticate');


//create new notification
route.post('/create', authenticateToken, async(req,res) => {
    try {
        const notificationObject = req.body
        notificationModel.create(notificationObject)
        res.send(notificationObject)
    } catch(err) {
        res.status(400).send(err);
    }
})

//fetch notifications
route.get('/', authenticateToken, async(req,res) => {
    try {
        const user = req.id
        const page = req.query.page;
        const pageSize = 20;
        const skip = (page - 1) * pageSize
        const notifications = await notificationModel.find({user: user}).sort({ date: -1, time: -1 }).skip(skip).limit(pageSize);
        res.send(notifications)
    } catch(err) {
        res.status(400).send(err)
    }
})

//delete notifications
route.delete('/delete', authenticateToken, async(req,res) => {
    try {
        const id = req.id
        console.log(id)
        //delete all notifications associated with user
        const deletedActivities = await notificationModel.deleteMany({ user: id });
        res.send(deletedActivities);
    } catch(err) {
        res.status(400).send(err)
    }
})


module.exports = route