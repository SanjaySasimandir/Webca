const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = function (socket, id, io) {
    socket.on('send message', (req) => {
        let messagereq = req;
        messagereq.messageSender['id'] = id;
        ChannelData.findById(req.channelid, { members: 1, messages: 1 }).then(channel => {
            delete messagereq.channelid;
            let memberstosend = channel.members.filter(member => member.id != id).map(member => member.id);
            console.log(id, memberstosend);
            io.to(memberstosend).emit('new message received',messagereq.message);
            if (channel) {
                if (channel.messages.length == 0 || channel.messages[channel.messages.length - 1].date != moment().format('LL')) {
                    channel.messages.push({ "date": moment().format('LL'), "messagesForTheDay": [] });
                }
                channel.messages[channel.messages.length - 1].messagesForTheDay.push(messagereq);
                channel.save();
            }
        });
    });
}