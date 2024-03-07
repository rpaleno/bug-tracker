require('dotenv').config()
const route = require('express').Router();
const crypto = require('crypto')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const userModel = require('../../Models/userModel')
const {generateAccessToken, generateRefreshToken } = require('./Utilities/tokenCreation');
const authenticateToken = require('./Middleware/authenticate');


//fetch users
route.get('/', (req, res) => {
    userModel.find().then((user)=> {
        if(!user) return res.status(400).send('no users')
        res.send(user)
    }).catch((err) => {
        if (err) res.status(400).send(err)
    })
})

//check if user exists
route.post('/check_user', async (req,res) => {
    try {
        const user = await userModel.findOne({name: req.body.name});
        res.send(user._id)
    } catch {
        res.status(500).send('error');
    }
})

//reset password
route.post('/reset_password', async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    try {
        const user = await userModel.findOne({email: req.body.email});
        
        if (!user) {
            return res.status(400).send('Email not found')
        }

        const token = generateAccessToken(user)

        const resetLink = `http://localhost:3000/reset-password?token=${token}`

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${resetLink}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Error sending email');
            }
            res.status(200).send('Password reset link sent successfully');
        })
        
    } catch(err) {
        res.status(400).send()
    }
})

//create user
route.post('/create_user', async (req,res)=>{
    const user = await userModel.findOne({name: req.body.name});
    if (user) {
        return res.status(400).send('Username already exists')
    }

    const email = await userModel.findOne({email: req.body.email});
    if (email) {
        return res.status(400).send('Email already exists')
    }

    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const user = { name: req.body.name, email: req.body.email, password: hashedPassword}
        userModel.create(user).then((user)=>{
            if(!user)return res.status(400).send('there was an error')
            res.send(user)
        })
            .catch((err)=> res.status(400).send(err))
    } catch {
        res.status(500).send;
    }
})

//update password
route.put('/user', authenticateToken, async (req,res)=>{
    const id = req.id
    const password = req.body.password

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    userModel.findByIdAndUpdate(id,{password: hashedPassword}).then((user)=>{
        if(!user) return res.status(400).send('no user')
        res.send('updated')
    })
        .catch((err)=>{
            if(err) res.status(400).send(err)
        })
})

//delete user
route.delete('/delete', authenticateToken, (req, res) => {
    const {_id} = req.body
    userModel.findByIdAndDelete(_id).then(user=>{
        if (!user) {
            return res.status(404).send('user not found');
        }
        res.send(user);
    })
    .catch((err) => res.status(400).send(err));
})

//user login
route.post('/login', async (req,res)=>{
    console.log(req.body.name)
    const user = await userModel.findOne({name: req.body.name});
    if (!user) {
        return res.status(400).send('user not found')
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.cookie('refreshToken', refreshToken, {
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
        })
        
        return res.send({accessToken});
    }
    
    else {
        return res.status(400).send('Invalid Password')
    }
})

//user logout
route.post('/logout', async (req,res)=>{
    const token = req.cookies.refreshToken
    if (!token) return res.sendStatus(204)
    res.clearCookie('refreshToken', {secure: true, sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000})
    res.send({message: 'Cookie cleared'});
    console.log('cookie cleared')
})


//refresh access token
route.post('/token', async (req,res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).send({message: 'Unauthorized'})
    }
    let payload = null;
    try {
        payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        return res.status(401).send({message: 'Unauthorized'})
    }
    const user = await userModel.findOne({name: payload.username})
    if (!user) {
        return res.status(401).send({message: 'User doesnt exist'})
    }
    let accessToken = generateAccessToken(user)
    const config = {
        user: payload.username,
        token: accessToken
    }
    return res.send(config);
})


module.exports = route

