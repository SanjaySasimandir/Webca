const express = require('express');
const moment = require('moment');
const FileRouter = express.Router();
const mongoose = require('mongoose');

const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const FolderData = require('../models/FolderData');
const jwt = require('jsonwebtoken');

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './files'
});

// FileRouter.post('/getFolder', (req, res) => {
//     let userid = jwt.verify(req.headers.token, "Lancia047").uniqueID;
//     let folderid = req.body.folderid;
//     let channelid = req.body.channelid;
//     ChannelData.findById(channelid, { members: 1 }).then(channel => {
//         console.log(channel);
//     });
// });

FileRouter.post('/uploadfile', multipartMiddleware, (req, res) => {
    let data = JSON.parse(req.files.uploads[0].name.split('|&&&|')[0]);
    let token = data.token;
    let user_id = jwt.verify(token, "Lancia047").uniqueID;
    let folderId = data.folderid;
    let channelid = data.channelid;
    ChannelData.findById(channelid, { members: 1 }).then(channel => {
        
    });
    let newpath = req.files.uploads[0].path.replace(/\\/ig, '/').replace('files/', '');
    let newfile = {
        "name": data.filename,
        "author": data.username,
        "uploadDate": moment().format('lll'),
        "filelocation": newpath,
        "filetype": data.filetype,
    }
    console.log(newfile)
    res.send({ "message": "success" });
});

const path = require('path');
FileRouter.get('/getFile/:name', (req, res) => {
    let filename = req.params.name;
    const options = {
        root: path.dirname(path.dirname(__dirname)) + '/files/',
        // root: path.join(__dirname, '/files'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }
    let user_id = jwt.verify(req.headers.token, "Lancia047").uniqueID;
    if (req.headers.token) {

        res.sendFile(filename, options);
    }
    else {
        res.send("hello");
    }
    // if (req.headers.token) {
    //     let user_id = jwt.verify(req.headers.token, "Lancia047").uniqueID;

    // }
});


module.exports = FileRouter;