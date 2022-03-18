var express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: "*"
    }
});

app.use(express.static('./public'));

const port =  3000;

const cors = require('cors');
app.use(cors());

const bodyparser = require('body-parser');
app.use(bodyparser.json());

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

const userRouter = require('./src/routes/user.route');
app.use('/users', userRouter);

app.get('/test', (req, res) => {
    res.send("working")
});

const RegistrationData = require('./src/models/RegistrationData');
app.get('/test', (req, res) => {
    res.send("working");
    var item = new RegistrationData();
    item.name = "Test Name";
    item.email = "testemail@example.com";
    item.password = "testpassword";
    item.fullName = "FullName";
    item.lastOnline = Date.now();
    item.chats = [];
    item.roles = "none"
    item.save();
});



http.listen(port, () => {
    console.log("Server Listening at port: " + port);
});