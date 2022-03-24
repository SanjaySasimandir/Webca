const express = require('express');
const userRouter = express.Router();

const RegistrationData = require('../models/RegistrationData');
const jwt = require('jsonwebtoken');

userRouter.post('/dupeUsernameCheck', (req, res) => {
    let username = req.body.username;
    RegistrationData.find({ username: username }).then((data) => {
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
    RegistrationData.find({ email: email }).then((data) => {
        if (data[0]) {
            res.send({ "message": "exists" });
        }
        else {
            res.send({ "message": "ok" });
        }
    });
});

userRouter.post('/signup', (req, res) => {
    let newuser = new RegistrationData(req.body.user);
    newuser.save();
    res.send({ "message": "success" });
});

userRouter.post('/login', (req, res) => {
    let usercreds = req.body.creds;
    RegistrationData.find({ username: usercreds.username, password: usercreds.password }).then(data => {
        if (data[0]) {
            let token = jwt.sign({ "uniqueID": data[0]._id }, 'Lancia047');
            res.send({ "message": "success", "token": token });
        }
        else{
            res.send({ "message": "invalid" });
        }
    })
});

module.exports = userRouter;