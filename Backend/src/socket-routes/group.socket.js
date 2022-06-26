const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const FolderData = require('../models/FolderData');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = function (socket, id, io) {
    socket.on('get groups trigger', () => {
        // UserData.findById(id, { groups: 1 }).then(user => {
        //     io.to(id).emit('get groups', (user.groups));
        // });
        sendGroups(io, id);
    });

    socket.on('dupe channel check', (req) => {
        GroupData.findById(req.groupid, { channels: 1 }).then(group => {
            let dupechannelboolean = !!(group.channels.filter(channel => channel.channelName == req.channelname).length);
            io.to(id).emit('dupe channel check result', { "message": dupechannelboolean });
        });
    });

    socket.on('add channel', (req) => {
        let user_id = jwt.verify(req.token, "Lancia047").uniqueID;
        let channelname = req.channelname;
        let groupid = req.groupid;
        let openness = req.openness;
        let grouprole = req.grouprole;
        UserData.findById(user_id).then(user => {
            GroupData.findOne({ _id: req.groupid, 'members.id': user_id }, { channels: 1, mainChannelId: 1 }).then(group => {
                ChannelData.findById(group.mainChannelId).then(mainChannel => {
                    let newChannel = new ChannelData({
                        name: channelname,
                        groupid: groupid,
                        channelOpenness: openness,
                        description: channelname,
                        picture: "",
                        pinnedMessage: "",
                        members: [],
                        messages: [{
                            date: moment().format('LL'), messagesForTheDay: [
                                {
                                    messageType: "text",
                                    message: `Welcome to ${channelname}`,
                                    messageSender: {
                                        username: "webca",
                                        fullname: "Webca Bot",
                                        id: "webcabot"
                                    },
                                    messageTime: moment().format('LT'),
                                }
                            ]
                        }]
                    });
                    let mainFolder = new FolderData();
                    mainFolder.name = newChannel.name;
                    mainFolder.author = user.username;
                    mainFolder.creationDate = moment().format('lll');
                    mainFolder.files = [];
                    mainFolder.folders = [];
                    mainFolder.save().then(mainFolder => {
                        newChannel.mainFolderId = mainFolder._id;

                        newChannel.save().then(newChannel => {
                            if (openness == 'public') {
                                newChannel.members = mainChannel.members;
                                newChannel.save();
                                newChannel.members.forEach(member => {
                                    addChannelToUserList(group._id, member.id, io, {
                                        channelname: newChannel.name,
                                        channelid: newChannel._id,
                                        channelpicture: newChannel.picture,
                                        channelrole: member.role
                                    });
                                });
                            }
                            else {
                                mainChannel.members.forEach(member => {
                                    if (member.role == 'owner' || member.role == 'admin') {
                                        newChannel.members.push({
                                            username: member.username,
                                            fullname: member.fullname,
                                            id: member.id,
                                            online: member.online,
                                            role: member.role,
                                            picture: member.picture
                                        });
                                        let channel_to_add = {
                                            channelname: newChannel.name,
                                            channelid: newChannel._id,
                                            channelpicture: newChannel.picture,
                                            channelrole: member.role
                                        };
                                        addChannelToUserList(group._id, member.id, io, channel_to_add);
                                        // io.to(id).emit('channel added', { channel: channel_to_add, groupid: group._id });
                                    }
                                });
                                newChannel.save();
                            }
                            let newChannelToGroup = {
                                channelName: channelname,
                                channelID: newChannel._id,
                                channelOpenness: openness,
                                channelPicture: '',
                            }
                            group.channels.push(newChannelToGroup);
                            group.save().then()
                        });
                    });

                });
            });
        });
    });

    socket.on('get invite string trigger', (req) => {
        if (req.groupid) {
            GroupData.findById(req.groupid, { inviteString: 1 }).then(group => {
                io.to(id).emit('get invite string', { "inviteString": group.inviteString });
            });
        }
    });

    socket.on('join group', (req) => {
        let user_id = jwt.verify(req.token, "Lancia047").uniqueID;
        let invString = req.inviteString;
        joingroup(user_id, invString, id, io);
    });

    socket.on('get channel members trigger', (req) => {
        ChannelData.find({ _id: req.channelid }, { members: { username: 1, fullname: 1, id: 1, role: 1, picture: 1 } }).then(data => {
            if (data.length) {
                io.to(id).emit('get channel members', { members: data[0].members });
            }
        });
    });

    socket.on('get members to add trigger', (req) => {
        let user_id = jwt.verify(req.token, "Lancia047").uniqueID;
        ChannelData.findById(req.mainchannelid, { members: { _id: 0 } }).then(mainchannel => {
            ChannelData.findById(req.selectedchannelid, { members: { _id: 0 } }).then(selectedchannel => {

                let difference_members = mainchannel.members.filter(mainmember => {
                    return !selectedchannel.members.some(selectmember => {
                        return mainmember.id == selectmember.id
                    })
                });
                io.to(id).emit('get members to add', { 'memberstoadd': difference_members });

            });
        });
    });

    socket.on('add user to channel', (req) => {
        let user_id = jwt.verify(req.token, "Lancia047").uniqueID;
        ChannelData.findById(req.channelid, { members: 1, groupid: 1, name: 1, members: 1, picture: 1 }).then(channel => {
            channel.members.push({
                username: req.member.username,
                fullname: req.member.fullname,
                id: req.member.id,
                online: req.member.online,
                role: req.member.role,
                picture: req.member.picture
            });
            console.log('channel', channel)
            channel.save();

            UserData.findById(req.member.id, { groups: 1 }).then(user => {
                user.groups.forEach(group => {
                    if (group.groupid == channel.groupid) {
                        group.channels.push({
                            channelname: channel.name,
                            channelid: channel._id,
                            channelpicture: channel.picture,
                            channelrole: req.member.role,
                        })
                        console.log('user', group.channels);
                    }
                });
                user.save();
            });
        });
    });

    socket.on('change user group role', (req) => {
        let user_id = jwt.verify(req.token, "Lancia047").uniqueID;
        GroupData.find({ _id: req.groupid }, { channels: { channelID: 1 }, members: { username: 1, id: 1, role: 1 } }).then(data => {
            if (data.length) {
                (data[0].members).forEach(member => {
                    if (member.id == req.member.id && member.username == req.member.username) {
                        member.role = req.member.role;
                        data[0].save();
                    }
                });
                UserData.find({ _id: req.member.id }, { groups: 1 }).then(user => {
                    if (user.length) {
                        (user[0].groups).forEach(group => {
                            if (group.groupid == req.groupid) {
                                group.grouprole = req.member.role;
                                group.channels.forEach(channel => {
                                    channel.channelrole = req.member.role;
                                });
                            }
                        });
                        user[0].save();
                    }
                });
                (data[0].channels).forEach(channel => {
                    ChannelData.find({ _id: channel.channelID, "members.id": req.member.id }).then(eachChannel => {
                        (eachChannel[0].members).forEach(member => {
                            if (member.id == req.member.id && member.username == req.member.username) {
                                member.role = req.member.role;
                                eachChannel[0].save();
                            }
                        });
                    });
                });
            }
        });
    });


}

function joingroup(id, invString, socket_id, io) {
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
                        let groupToPush = {
                            groupname: group.name,
                            groupid: group._id,
                            grouppicture: group.picture,
                            grouprole: 'member',
                            channels: []
                        };

                        group.channels.forEach(channel => {
                            if (channel.channelOpenness == 'public') {
                                groupToPush.channels.push({
                                    channelname: channel.channelName,
                                    channelid: channel.channelID,
                                    channelpicture: channel.channelPicture,
                                    channelrole: 'member',
                                });
                                ChannelData.findById(channel.channelID).then(eachChannel => {
                                    eachChannel.members.push({
                                        username: user.username,
                                        fullname: user.fullName,
                                        id: user._id,
                                        online: true,
                                        role: 'member',
                                        picture: user.picture
                                    });
                                    eachChannel.save();
                                });
                            }
                        });
                        user.groups.push(groupToPush);
                        console.log(groupToPush);
                        user.save().then(() => {
                            io.to(socket_id).emit('join group response', { "message": "done" });
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

function addChannelToUserList(groupid, userid, io, channel) {
    UserData.findById(userid).then(user => {
        user.groups.forEach(group => {
            if (group.groupid == groupid) {
                group.channels.push(channel);
            }
        });
        user.save().then(user => {
            sendGroups(io, userid);
        });
    });
}

function sendGroups(io, id) {
    UserData.findById(id, { groups: 1 }).then(user => {
        io.to(id).emit('get groups', (user.groups));
    });
}