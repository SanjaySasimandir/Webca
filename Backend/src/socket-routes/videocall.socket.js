const { v4: uuidv4 } = require('uuid');
const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const VideoCallData = require('../models/VideoCallData');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = function (socket, id, io) {

    socket.on('join-room', (req) => {
        let roomId = req.roomId;
        let userId = req.userId;
        // console.log('roomId:', roomId, 'userId:', userId);
        socket.join(roomId);
        // socket.broadcast.to(roomId).emit('user-connected', userId);
        let dataToSend = { userId: userId, details: { fullname: req.fullname, username: req.username } };
        socket.broadcast.to(roomId).emit('user-connected', dataToSend);
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        });
    });

    socket.on('fetch channel and attendance', (req) => {
        let user_id = jwt.verify(req.token, "Lancia047").uniqueID;
        VideoCallData.findOne({ videoRoomLink: req.roomid }).then(room => {
            if (room) {
                ChannelData.find({ _id: room.channelid, 'members.id': user_id }).then(channel => {
                    if (channel.length) {
                        if (req.roomid == channel[0].currentvideoRoomLink) {
                            let member = channel[0].members.filter(member => member.id == user_id)[0];
                            let dataToSend = {
                                channelname: channel[0].name,
                                channelid: channel[0]._id,
                                channelpicture: channel[0].picture,
                                channelrole: member.role
                            }

                            io.to(id).emit('get video room channel', { "channel": dataToSend })
                        }
                        else {
                            io.to(id).emit('invalid room link', { "message": "link expired" });
                        }
                    }
                    else {
                        io.to(id).emit('invalid room link', { "message": "not authorized" });
                    }
                });
            }
            else {
                io.to(id).emit('invalid room link', { "message": "invalid link" });
            }
        });
    });

    socket.on('get video call link trigger', (req) => {
        let user_id = jwt.verify(req.token, "Lancia047").uniqueID;
        UserData.findById(user_id, { username: 1 }).then(user => {
            ChannelData.findById(req.channelid, { videoRoomsList: 1, currentvideoRoomId: 1, currentvideoRoomLink: 1 }).then(channel => {
                if (channel.videoRoomsList.length == 0) {
                    let room = new VideoCallData();
                    room.channelid = req.channelid;
                    room.creationDate = moment().format('lll');
                    room.creator = {
                        username: user.username,
                        userid: user._id,
                    };
                    room.activeMembers = [{
                        username: user.username,
                        userid: user._id,
                    }];
                    room.attendedMembers = [{
                        username: user.username,
                        userid: user._id,
                    }];
                    room.blockedMembers = [];
                    room.videoRoomLink = uuidv4();
                    room.save().then(room => {
                        channel.videoRoomsList.push({
                            videoRoomId: room._id,
                            videoRoomLink: room.videoRoomLink
                        });
                        channel.currentvideoRoomId = room._id;
                        channel.currentvideoRoomLink = room.videoRoomLink;
                        channel.save();
                        io.to(id).emit('get video call link', { "roomlink": room.videoRoomLink });
                    });
                }
                else {
                    io.to(id).emit('get video call link', { "roomlink": channel.currentvideoRoomLink });
                }
            });
        });
    });
}
