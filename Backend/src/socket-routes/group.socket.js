const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const jwt = require('jsonwebtoken');

module.exports = function (socket, id, io) {
    socket.on('get groups trigger', () => {
        UserData.findById(id, { groups: 1 }).then(user => {
            io.to(id).emit('get groups', (user.groups));
        });
    });

    socket.on('dupe channel check', (req) => {
        GroupData.findById(req.groupid, { channels: 1 }).then(group => {
            console.log(!!group.channels.filter(channel => channel.channelName == req.channelname).length)
            let dupechannelboolean = !!(group.channels.filter(channel => channel.channelName == req.channelname).length);
            io.to(id).emit('dupe channel check result', { "message": dupechannelboolean });
        });
    });

    socket.on('add channel', (req) => {
        console.log('add channel', req)
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