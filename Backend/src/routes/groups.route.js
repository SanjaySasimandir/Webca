const express = require('express');
const moment = require('moment');
const GroupRouter = express.Router();

const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const jwt = require('jsonwebtoken');

GroupRouter.post('/create', (req, res) => {
    let id = jwt.verify(req.body.data.token, "Lancia047").uniqueID;
    UserData.findById(id, { username: 1, fullName: 1 }).then((data) => {
        if (data) {
            let group = new GroupData();
            group.name = req.body.data.groupname;
            group.openness = req.body.data.openness;
            group.creationDetails.creatorName = data.fullName;
            group.creationDetails.creatorUsername = data.username;
            group.creationDetails.creatorID = id;
            group.creationDetails.creationTime = moment().format('lll');
            let main_channel = new ChannelData();
            main_channel.name = "main";
            main_channel.members = [{
                username: data.username,
                fullname: data.fullName,
                id: id,
                online: true,
                role: 'owner'
            }];
            main_channel.save().then(channel => {
                group.channels = [{
                    channelName: channel.name,
                    channelID: channel._id
                }];
                group.members = [{
                    username: data.username,
                    fullname: data.fullName,
                    id: id,
                    online: true,
                    role: 'owner'
                }]
                group.save().then(response => {
                    UserData.findById(id).then(user => {
                        user.groups.push({
                            groupname: response.name,
                            groupid: response._id,
                            grouppicture: response.picture,
                            grouprole: 'owner',
                            channels: [{
                                channelname: channel.name,
                                channelid: channel._id,
                                channelpicture: channel.picture,
                                channelrole: 'owner'
                            }]
                        });
                        user.save().then(() => {
                            if (response) {
                                res.send({ "message": "success" })
                            }
                        })
                    })
                });
            });
        }
    });
});

module.exports = GroupRouter;