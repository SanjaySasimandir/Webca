const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');

module.exports = function (socket, id, io) {
    UserData.findById(id, { groups: 1 }).then(user => {
        io.to(id).emit('get groups', (user.groups));
    });
}