const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');

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
}