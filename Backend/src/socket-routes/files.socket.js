const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const FolderData = require('../models/FolderData');
const jwt = require('jsonwebtoken');

module.exports = function (socket, id, io) {
    socket.on('get main folder trigger', (req) => {
        ChannelData.findById(req.channelid, { mainFolderId: 1 }).then(channel => {
            FolderData.findById(channel.mainFolderId).then(folder => {
                io.to(id).emit('get main folder', folder);
            });
        });
    });
}