const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = function (socket, id, io) {
    socket.on('get groups trigger', () => {
        UserData.findById(id, { groups: 1 }).then(user => {
            io.to(id).emit('get groups', (user.groups));
        });
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
        console.log(user_id, channelname, groupid, openness);
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
                        members: [
                            /*{
                                username: user.username,
                                fullname: user.fullname,
                                id: user._id,
                                online: true,
                                role: grouprole,
                                picture: user.picture
                            }*/
                        ],
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
                            newChannel.save();
                            mainChannel.members.forEach(member => {
                                if (member.role == 'owner' || member.role == 'admin') {
                                    addChannelToUserList(group._id, member.id, io, {
                                        channelname: newChannel.name,
                                        channelid: newChannel._id,
                                        channelpicture: newChannel.picture,
                                        channelrole: member.role
                                    });
                                }
                            });
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
        console.log('add channel', channelname, groupid, user_id);
    });

    socket.on('get invite string trigger', (req) => {
        console.log(req)
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
                    console.log(group)
                    group.save().then(() => {

                        ChannelData.findById(group.mainChannelId).then(channel => {
                            console.log(channel)
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
                                    io.to(socket_id).emit('join group response', { "message": "done" });
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

function addChannelToUserList(groupid, userid, io, channel) {
    UserData.findById(userid).then(user => {
        user.groups.forEach(group => {
            if (group.groupid == groupid) {
                group.channels.push(channel);
            }
        });
        user.save().then(user => {
            io.to(userid).emit('get groups', (user.groups));
        });
    });
}