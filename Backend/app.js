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
/*********Router Definition - Ends *********/


const moment = require('moment');


const jwt = require('jsonwebtoken');
const UserData = require('./src/models/UserData');

let connectedUsers = new Map();

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


    socket.on('disconnect', () => {
        console.log('User Disconnected: ', username);
        socket.leave(id)
    })
});




const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log("Server Listening at port: " + port);
});