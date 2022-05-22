const { uuid } = require('uuidv4');
const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const VideoCallData = require('../models/VideoCallData');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = function (socket, id, io) {
    socket.on('get video call link trigger', (req) => {
        let user_id = jwt.verify(req.token, "Lancia047").uniqueID;
        UserData.findById(user_id, { username: 1 }).then(user => {
            ChannelData.findById(req.channelid, { videoRoomId: 1, videoRoomsList: 1, videoRoomLink: 1 }).then(channel => {
                if (channel.videoRoomsList = []) {
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
                    room.save().then(room => {
                        channel.videoRoomsList.push(room._id);
                        channel.videoRoomId = room._id;
                        channel.videoRoomLink = uuid();
                        io.to(id).emit('get video call link', { "roomlink": channel.videoRoomLink });
                        channel.save();
                    });
                }
                else {
                    io.to(id).emit('get video call link', { "roomlink": channel.videoRoomLink });
                }
            });
        });
    });
}