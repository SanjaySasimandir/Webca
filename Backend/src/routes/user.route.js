const express = require('express');
const userRouter = express.Router();

const RegistrationData = require('../models/RegistrationData');

userRouter.get('/test', (req, res) => {
    console.log('testherde');
    res.send('here');
});


userRouter.get('/usernameUniqueCheck', (req, res) => {
    console.log('here');
    let ext = req.params;
    console.log(req.body);
    res.send('success')
});

module.exports = userRouter;