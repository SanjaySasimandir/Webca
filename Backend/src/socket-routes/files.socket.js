const UserData = require('../models/UserData');
const GroupData = require('../models/GroupData');
const ChannelData = require('../models/ChannelData');
const FolderData = require('../models/FolderData');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = function (socket, id, io) {
    socket.on('get main folder trigger', (req) => {
        ChannelData.findById(req.channelid, { mainFolderId: 1 }).then(channel => {
            FolderData.findById(channel.mainFolderId).then(folder => {
                io.to(id).emit('get main folder', folder);
            });
        });
    });

    socket.on('get folder trigger', (req) => {
        FolderData.findById(req.folderid).then(folder => {
            io.to(id).emit('get folder', folder);
        });
    });

    socket.on('create folder', (req) => {
        let user_id = jwt.verify(req.token, "Lancia047").uniqueID;
        UserData.findById(user_id, { username: 1 }).then(user => {
            if (user) {
                FolderData.findById(req.folderid).then(parentFolder => {
                    if (parentFolder) {
                        let folderDoesntAlreadyExist = !parentFolder.folders.filter(folder => folder.name == req.foldername).length;
                        if (folderDoesntAlreadyExist) {
                            let newFolder = new FolderData({
                                name: req.foldername,
                                author: user.username,
                                channelid: req.channelid,
                                creationDate: moment().format('lll'),
                                files: [],
                                folders: []
                            });


                            newFolder.save().then(folder => {
                                parentFolder.folders.push({ name: folder.name, folderid: folder._id });
                                parentFolder.folders.sort(compare_name)
                                parentFolder.save().then(folder => {
                                    io.to(id).emit('refresh parent folder', folder);
                                });
                            });
                        }
                    }
                });
            }
        });
    });
}

function compare_name(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
    }
    return 0;
}