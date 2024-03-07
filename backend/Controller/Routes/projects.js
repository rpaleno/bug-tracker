require('dotenv').config()
const route = require('express').Router();
const jwt = require('jsonwebtoken')
const projectModel = require('../../Models/projectModel');
const userModel = require('../../Models/userModel')
const authenticateToken = require('./Middleware/authenticate');

//create new project
route.post('/create', authenticateToken, async (req,res)=>{
    try {
        const newProject = req.body;
        newProject.creator = req.id;
        const project = await projectModel.create(newProject);
    
        await project.populate({
            path: 'creator',
            select: 'name',
            model: userModel
        })
        
        res.send(project);
    } catch (error) {
        console.error(error);
        res.status(400).send('There was an error');
    }
})

//fetch projects
route.get('/', authenticateToken, async (req, res) => {
    const id = req.id
    const page = req.query.page;
    const pageSize = 20;
    const skip = (page - 1) * pageSize
    const sortBy = req.query.sortBy
    const view = req.query.view
    let sortingOrder
    let filter = {}
    
    if (sortBy === "Priority") {
        sortingOrder = {priority: 1};
    } else if (sortBy === "Latest") {
        sortingOrder = {dateCreated: -1}
    } else {
        sortingOrder = {name: 1}
    }

    if (view === "In-Progress") {
        filter.dateCompleted = "";
    } else if (view === "Completed") {
        filter.dateCompleted = { $ne: "" }; 
    }

    const query = {
        $or: [
            { 'members.user': id },
            { creator: id }
        ],
        ...filter
    };

    try {
        const projects = await projectModel
            .find(query)
            .sort(sortingOrder)
            .skip(skip).limit(pageSize)
            .populate([
                {
                    path: 'creator',
                    select: 'name', 
                    model: userModel 
                },
                {
                    path: 'members.user',
                    select: 'name', 
                    model: userModel
                },
            ])
    
        if (projects.length === 0) {
            return res.status(404).send('No projects found');
        }
    
        return res.send(projects);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//update project
route.put('/update', authenticateToken, async (req,res)=>{
    const {_id, name, details, priority, creator, members, dateCreated, dateCompleted} = req.body
    try {
        const updatedProject = 
        await projectModel.findByIdAndUpdate(_id,{name, details, priority, creator, members, dateCreated, dateCompleted}, {new: true})
        .populate([
            {
                path: 'creator',
                select: 'name', 
                model: userModel 
            },
            {
                path: 'members.user',
                select: 'name', 
                model: userModel 
            }
        ])

        if (updatedProject.length === 0) {
            return res.status(404).send('Project not found');
        }
        return res.send(updatedProject)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//delete project
route.delete('/delete', authenticateToken, (req, res) => {
    const {_id} = req.body
    projectModel.findByIdAndDelete(_id).then(project => {
        if (!project) {
            return res.status(404).send('project not found');
        }
        res.send(project);
    })
    .catch((err) => res.status(400).send(err));
})

module.exports = route