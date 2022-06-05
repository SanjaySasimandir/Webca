const express = require('express');
const moment = require('moment');
const GroupRouter = express.Router();
const mongoose = require('mongoose');

const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const FolderData = require('../models/FolderData');
const jwt = require('jsonwebtoken');

function inviteStringGenerator() {
    let invString = "";
    do {
        invString = mongoose.Types.ObjectId().toString();
    } while (invString.length % 4 != 0);
    invString = invString.match(/.{1,4}/g).join('-');
    return invString;
}

GroupRouter.post('/create', (req, res) => {
    let id = jwt.verify(req.body.data.token, "Lancia047").uniqueID;
    UserData.findById(id, { username: 1, fullName: 1, picture: 1 }).then((data) => {
        if (data) {

            let group = new GroupData();
            group.name = req.body.data.groupname;
            group.openness = req.body.data.openness;
            group.picture = "";
            group.inviteString = inviteStringGenerator();
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
                role: 'owner',
                picture: data.picture
            }];
            main_channel.messages = [{
                date: moment().format('LL'), messagesForTheDay: [
                    {
                        messageType: "text",
                        message: `Welcome to ${main_channel.name}`,
                        messageSender: {
                            username: "webca",
                            fullname: "Webca Bot",
                            id: "webcabot"
                        },
                        messageTime: moment().format('LT'),
                    }
                ]
            }]

            main_channel.save().then(channel => {
                group.channels = [{
                    channelName: channel.name,
                    channelID: channel._id,
                    channelOpenness: "public",
                    channelPicture: "",
                }];
                group.members = [{
                    username: data.username,
                    fullname: data.fullName,
                    id: id,
                    online: true,
                    role: 'owner',
                    picture: data.picture
                }];

                let mainFolder = new FolderData();
                mainFolder.name = channel.name;
                mainFolder.author = data.username;
                mainFolder.creationDate = moment().format('lll');
                mainFolder.files = [];
                mainFolder.folders = [];
                mainFolder.save().then(mainFolder => {
                    main_channel.mainFolderId = mainFolder._id;

                    // });

                    group.save().then(response => {
                        main_channel.groupid = response._id;
                        main_channel.save().then(main_channel => {
                            group.mainChannelId = main_channel._id;
                            group.save()
                        });

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
            });
        }
    });
});

GroupRouter.post('/inviteinquiry', (req, res) => {
    let id = jwt.verify(req.body.data.token, "Lancia047").uniqueID;
    let invString = req.body.data.inviteString;
    GroupData.find({ inviteString: invString }, { name: 1, picture: 1, members: 1 }).then((grouparr) => {
        if (grouparr[0]) {
            let group = grouparr[0];
            if (group.members.filter(member => member.id == id).length != 0) {
                res.send({ "message": "member already" });
            }
            else {
                res.send({
                    "message": "not member",
                    "name": group.name,
                    "picture": group.picture,
                    "membercount": group.members.length
                });
            }
        }
    });
});

function joingroup() {
    // let id = jwt.verify(req.body.data.token, "Lancia047").uniqueID;
    // let invString = req.body.data.invString;
    UserData.findById(id).then(user => {
        if (user) {
            GroupData.find({ inviteString: invString }).then(grouparr => {
                if (grouparr[0]) {
                    let group = grouparr[0];
                    group.members.push({
                        username: user.username,
                        fullname: user.fullName,
                        id: user._id,
                        online: true,
                        role: 'member',
                        picture: user.picture
                    });
                    group.save().then(() => {

                        ChannelData.findById(group.mainChannelId).then(channel => {
                            channel.members.push({
                                username: user.username,
                                fullname: user.fullName,
                                id: user._id,
                                online: true,
                                role: 'member',
                                picture: user.picture
                            });
                            channel.save().then(() => {
                                user.groups.push({
                                    groupname: group.name,
                                    groupid: group._id,
                                    grouppicture: group.picture,
                                    grouprole: 'member',
                                    channels: [{
                                        channelname: channel.name,
                                        channelid: channel._id,
                                        channelpicture: channel.picture,
                                        channelrole: 'member',
                                    }]
                                });
                                user.save().then(() => {
                                    res.send({ "message": "joined successfully" });
                                });
                            });
                        });

                    });

                }
                else {
                    res.send({ "message": "Invalid Invite String" });
                }
            });
        }
    });
}


module.exports = GroupRouter;