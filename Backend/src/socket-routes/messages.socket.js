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
            let memberstosend = channel.members.filter(member => member.id != id).map(member => member.id);
            if (channel.members.length > 1) {
                io.to(memberstosend).emit('new message received', messagereq);
            }
            delete messagereq.channelid;
            if (channel) {
                if (channel.messages.length == 0 || channel.messages[channel.messages.length - 1].date != moment().format('LL')) {
                    channel.messages.push({ "date": moment().format('LL'), "messagesForTheDay": [] });
                }
                channel.messages[channel.messages.length - 1].messagesForTheDay.push(messagereq);
                channel.save();
            }
        });
    });

    socket.on('get channel messages trigger', (req) => {
        let user_id = jwt.verify(req.token, "Lancia047").uniqueID;
        let channelid = req.channelid;
        UserData.findById(user_id, { _id: 1 }).then(user => {
            if (user) {
                ChannelData.findById(channelid, { messages: 1 }).then(channel => {
                    if (channel) {
                        let dataToSend = { "channelid": channelid, "messages": channel.messages };
                        io.to(id).emit('get channel messages', dataToSend)
                    }
                });
            }
        });
    });
}