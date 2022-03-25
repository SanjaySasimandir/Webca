var express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: "*"
    }
});
const port = process.env.PORT || 3000;

app.use(express.static('./public'));

var corsMiddleware = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '0.0.0.0'); //replace localhost with actual host
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');

    next();
}
app.use(corsMiddleware);


const cors = require('cors');
app.use(cors());

const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

const userRouter = require('./src/routes/user.route');
app.use('/users', userRouter);

const verifyRouter = require('./src/routes/verify.route');
app.use('/verify', verifyRouter);



app.listen(port, () => {
    console.log("Server Listening at port: " + port);
});