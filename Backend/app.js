var express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: "*"
    }
});

const cors = require('cors');
app.use(cors());

const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public'));



/*********Router Definition - Starts *********/
const userRouter = require('./src/routes/user.route');
app.use('/users', userRouter);

const verifyRouter = require('./src/routes/verify.route');
app.use('/verify', verifyRouter);

const GroupRouter = require('./src/routes/groups.route');
app.use('/groups', GroupRouter);

const FilesRouter = require('./src/routes/files.route');
app.use('/files', FilesRouter);
/*********Router Definition - Ends *********/

const path = require('path');

app.get('', (req, res) => {
    res.send('works');
});
const moment = require('moment');


const jwt = require('jsonwebtoken');
const UserData = require('./src/models/UserData');
const { get } = require('mongoose');

let connectedUsers = new Map();
let roomDetails = new Map();
io.on('connection', (socket) => {

    let token = socket.handshake.query.token;
    let id = jwt.verify(token, 'Lancia047').uniqueID;

    let username;
    socket.join(id);

    UserData.findById(id, { username: 1 }).then((data) => {
        console.log('User Connected:', data.username);
        username = data.username;
    });
    require('./src/socket-routes/group.socket')(socket, id, io);
    require('./src/socket-routes/messages.socket')(socket, id, io);
    require('./src/socket-routes/files.socket')(socket, id, io);
    require('./src/socket-routes/videocall.socket')(socket, id, io, roomDetails);


    socket.on('disconnect', () => {
        console.log('User Disconnected: ', username);
        socket.leave(id)
    })
});




const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log("Server Listening at port: " + port);
});