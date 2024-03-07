const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authDB = require('./Database/auth')
const bugDB = require('./Database/bugTracker')
const authRoutes = require('./Controller/Routes/auth')
const projectRoutes = require('./Controller/Routes/projects')
const bugRoutes = require('./Controller/Routes/bugs')
const inviteRoutes = require('./Controller/Routes/invites')
const activityRoutes = require('./Controller/Routes/activity')
const notificationRoutes = require('./Controller/Routes/notifications')
const app = express()
const http = require('http')
const socketIO = require('socket.io')

const server = http.createServer(app)

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // only accessible by this origin
    methods: ["GET", "POST", "PUT"], // only get,post,put allowed
  },
 
});

const socketToUsernameMap = new Map();


const portbugDB = 3500;
const portauthDB = 3501;
const portSocketIO = 3502;

app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(cookieParser())

const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true //enable cookies
};


app.use(cors(corsOptions)); //enable CORS


app.use('/bugs', bugRoutes)
app.use('/projects', projectRoutes)
app.use('/auth', authRoutes)
app.use('/invite', inviteRoutes)
app.use('/activity', activityRoutes)
app.use('/notifications', notificationRoutes)


bugDB.on('error', console.error.bind(console, 'Connection error for bugDB:'));
bugDB.once('open', () => {
  console.log('Connected to bugDB');
  app.listen(portbugDB, () => {
    console.log(`Server for bugDB is running on port ${portbugDB}`);
  });
});

authDB.on('error', console.error.bind(console, 'Connection error for authDB:'));
authDB.once('open', () => {
  console.log('Connected to authDB');
  app.listen(portauthDB, () => {
    console.log(`Server for authDB is running on port ${portauthDB}`);
  });
});






io.on('connection', (socket) => {
  socket.on('setUsername', (username) => {
    //associate the provided username with the socket ID
    socketToUsernameMap.set(username, socket.id);
    console.log(`User with ID ${socket.id} set username: ${username}`);
  });

  socket.on('createActivity', (username) => {
    const socketId = socketToUsernameMap.get(username)

    //emit a notification event to the user
    io.to(socketId).emit('notification', { type: 'activity', message: 'New activity created!' });
  });

  socket.on('createInvite', (username) => {
    const socketId = socketToUsernameMap.get(username)

    //emit a notification event to the user
    io.to(socketId).emit('notification', { type: 'invite', message: 'New invite created!' });
  });
  
  //handle disconnect event
  socket.on('disconnect', () => {
    console.log(`User with ID ${socket.id} disconnected`);
  });
});


io.on('error', (error) => {
  console.error('Socket.IO error:', error);
});

server.listen(portSocketIO, () => {
  console.log(`Socket.IO server is running on port ${portSocketIO}`);
});

