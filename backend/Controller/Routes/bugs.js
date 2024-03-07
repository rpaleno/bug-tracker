require('dotenv').config()
const route = require('express').Router();
const bugModel = require('../../Models/bugModel');
const userModel = require('../../Models/userModel')
const authenticateToken = require('./Middleware/authenticate');

//create new bug
route.post('/create', authenticateToken, async (req,res)=>{
    const newBug = req.body
    newBug.creator = req.id
    bugModel.create(newBug)
    .then(createdBug => {
        return bugModel.populate(createdBug, [
            {
                path: 'creator',
                select: 'name',
                model: userModel
            },
            {
                path: 'assigned',
                select: 'name',
                model: userModel
            },
            {
                path: 'project',
                populate: {
                    path: 'members.user',
                    select: 'name',
                    model: userModel
                }
            }
        ]);
    })
    .then(populatedBug => {
        res.send(populatedBug);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
})

//fetch bugs
route.get('/', authenticateToken, async (req, res) => {
    try {
        const page = req.query.page
        const pageSize = 20
        const skip = (page - 1) * pageSize
        const projectID = req.query.projectID
        const userID = req.id
        const role = req.query.role
        const sortBy = req.query.sortBy
        const view = req.query.view
        let sortingOrder
        let filter
        
        if (role !== 'admin' || role != 'tester') {
            filter = {project: projectID}
        } else {
            filter = {project: projectID, assigned: userID}
        }
       
        if (view === "In-Progress") {
            filter.dateCompleted = "";
        } else if (view === "Completed") {
            filter.dateCompleted = { $ne: "" }; 
        }

        if (sortBy === "Priority") {
            sortingOrder = {priority: 1};
        } else if (sortBy === "Version") {
            sortingOrder = {version: 1}
        } else {
            sortingOrder = {dateCreated: -1}
        }

        const bugs = await bugModel.find(filter).sort(sortingOrder).skip(skip).limit(pageSize)
        .populate([
            {
                path: 'creator',
                select: 'name', 
                model: userModel
            },
            {
                path: 'assigned',
                select: 'name', 
                model: userModel 
            },
            {
                path: 'project',
                populate: {
                    path: 'members.user',
                    select: 'name',
                    model: userModel
                }
            },

        ])
        return res.send(bugs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

//update bug
route.put('/update', async (req,res)=>{
    const {_id, name, details, steps, version, priority, assigned, creator, project, dateCreated, dateCompleted} = req.body

    try {
        const updatedBug = await bugModel.findByIdAndUpdate(
            _id,
            { name, details, steps, version, priority, assigned, creator, project, dateCreated, dateCompleted },
            { new: true }
        ).exec(); 
    
        if (!updatedBug) return res.status(404).send('no bug');
        
        await updatedBug
            .populate([
                {
                    path: 'creator',
                    select: 'name',
                    model: userModel
                },
                {
                    path: 'assigned',
                    select: 'name',
                    model: userModel
                },
                {
                    path: 'project',
                    populate: {
                        path: 'members.user',
                        select: 'name',
                        model: userModel
                    }
                }
            ])

        res.send(updatedBug);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

//delete bug
route.delete('/delete', (req, res) => {
    const {_id} = req.body
    bugModel.findByIdAndDelete(_id).then(bug => {
        if (!bug) {
            return res.status(404).send('bug not found');
        }
        res.send(bug);
    })
    .catch((err) => res.status(400).send(err));
})


module.exports = route
