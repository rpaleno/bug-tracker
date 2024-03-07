require('dotenv').config()
const route = require('express').Router();
const jwt = require('jsonwebtoken')
const inviteModel = require('../../Models/inviteModel');
const userModel = require('../../Models/userModel')
const projectModel = require('../../Models/projectModel')
const authenticateToken = require('./Middleware/authenticate');

//create new invite
route.post('/create', authenticateToken, async (req, res) => {
    try {
        const newInvite = req.body
        newInvite.sender = req.id
        const invite = await inviteModel.create(newInvite)

        //populate the reference field and send the response
        const populatedInvite = await inviteModel
            .findById(invite._id)
            .populate([
                {
                    path: 'sender',
                    select: 'name -_id', //omit the id from population
                    model: userModel //specify the userModel for population
                },
                {
                    path: 'recipient',
                    select: 'name', 
                    model: userModel 
                },
                {
                    path: 'project',
                    populate: {
                        path: 'creator',
                        select: 'name -_id',
                        model: userModel
                      } 
                },
            ])

        if (!populatedInvite) {
            return res.status(400).send('There was an error');
        }

        res.send(populatedInvite)
    } catch (err) {
        res.status(400).send(err)
    }
  });

//fetch invites
route.get('/', authenticateToken, async (req, res) => {
    try {
        const sortBy = req.query.sortBy
        const status = req.query.status
        const page = req.query.page
        const pageSize = 20
        const skip = (page - 1) * pageSize
        let sortingOrder
        let messageStatus
        let filter;

        if (sortBy === "Latest") {
            sortingOrder = {dateCreated: -1}
        }
        else {
            sortingOrder = {role: 1}
        }
  
        if (status === 'Inbox') {
            messageStatus = 'pending'
            filter = {recipient: req.id, status: messageStatus}
        } else {
            filter = {sender: req.id}
        }

        const invites = await inviteModel.find({
            ...filter
        }).sort(sortingOrder).skip(skip).limit(pageSize)
        .populate([
                {
                    path: 'sender',
                    select: 'name', 
                    model: userModel 
                },
                {
                    path: 'recipient',
                    select: 'name', 
                    model: userModel 
                },
                {
                    path: 'project',
                    populate: {
                        path: 'creator',
                        select: 'name',
                        model: userModel
                      } 
                },
            ])
        
        return res.send(invites);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

//update invite
route.put('/update', authenticateToken, async (req, res) => {
    const {_id, recipient, sender, project, status, role, dateCreated} = req.body

    try {
    const updatedInvite = await inviteModel.findByIdAndUpdate(_id,{recipient, sender, project, status, role, dateCreated}, {new: true})
    if (!updatedInvite) return res.status(404).send('no invite')
    await updatedInvite
    .populate([
        {
            path: 'project',
                    populate: {
                        path: 'creator',
                        select: 'name',
                        model: userModel
                      } 
        },
    ])

    res.send(updatedInvite);
    } catch (err) {
    res.status(400).send(err.message);
    }
})

//delete invite
route.delete('/delete', authenticateToken, async (req, res) => {
    const {_id} = req.body
    inviteModel.findByIdAndDelete(_id).then(invite => {
        if (!invite) {
            return res.status(404).send('invite not found');
        }
        res.send(invite);
    })
    .catch((err) => res.status(400).send(err));
})

module.exports = route