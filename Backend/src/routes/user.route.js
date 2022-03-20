const express = require('express');
const userRouter = express.Router();

const RegistrationData = require('../models/RegistrationData');

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

userRouter.post('/signup', (req, res) => {
    let newuser = new RegistrationData(req.body.user);
    console.log(req.body.user);
    console.log('newuser',newuser);
    newuser.save();
    res.send({ "message": "success" });
});

module.exports = userRouter;