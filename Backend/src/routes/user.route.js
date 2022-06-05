const express = require('express');
const userRouter = express.Router();

const UserData = require('../models/UserData');
const jwt = require('jsonwebtoken');

userRouter.post('/dupeUsernameCheck', (req, res) => {
    let username = req.body.username;
    UserData.find({ username: username }).then((data) => {
        if (data[0]) {
            res.send({ "message": "exists" });
        }
        else {
            res.send({ "message": "ok" });
        }
    });
});

userRouter.post('/dupeEmailCheck', (req, res) => {
    let email = req.body.email;
    UserData.find({ email: email }).then((data) => {
        if (data[0]) {
            res.send({ "message": "exists" });
        }
        else {
            res.send({ "message": "ok" });
        }
    });
});


userRouter.post('/signup', (req, res) => {
    let newuser = new UserData(req.body.user);
    newuser.save();
    res.send({ "message": "success" });
});

userRouter.post('/login', (req, res) => {
    let usercreds = req.body.creds;
    UserData.find({ username: usercreds.username, password: usercreds.password }, { fullName: 1 }).then(data => {
        if (data[0]) {
            let token = jwt.sign({ "uniqueID": data[0]._id }, 'Lancia047');
            res.send({ "message": "success", "token": token, "fullname": data[0].fullName });
        }
        else {
            res.send({ "message": "invalid" });
        }
    })
});

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './public/pfp'
});

userRouter.post('/uploadPFP', multipartMiddleware, (req, res) => {
    let username = req.files.uploads[0].name.split('|&&&|')[0];

    UserData.find({ username: username }).then(data => {
        if (data[0]) {
            data[0].picture = req.files.uploads[0].path.replace(/\\/ig, '/').replace('public/', '');
            data[0].save();
            res.send({ 'message': 'success' });
        }
    })
});

const path = require('path');
userRouter.post('/getPFP', (req, res) => {
    let userId = jwt.verify(req.body.token, 'Lancia047').uniqueID;

    UserData.findById(userId, { picture: 1 }).then((data) => {
        res.send({ "pfpURL": data.picture });
    });

});

module.exports = userRouter;