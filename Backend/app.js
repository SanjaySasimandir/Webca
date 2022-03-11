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

const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());

const bodyparser = require('body-parser');
app.use(bodyparser.json());

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.send("working")
});

http.listen(port, () => {
    console.log("Server Listening at port: " + port);
});