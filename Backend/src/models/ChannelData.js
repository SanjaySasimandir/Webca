// Accessing Mongoose Package
const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb+srv://bladerunner:bladerunner@clustertopgear.8ok4c.mongodb.net/Valkyrie?retryWrites=true&w=majority');

// Schema Definition
const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
    name: String,
    groupid: String,
    channelOpenness: String,
    description: String,
    picture: String,
    pinnedMessage: String,
    members: [{
        username: String,
        fullname: String,
        id: String,
        online: Boolean,
        role: String,
        picture: String
    }],
    messages: [{
        date: String,
        messagesForTheDay: [{
            messageType: String,
            message: String,
            messageSender: {
                username: String,
                fullname: String,
                id: String
            },
            messageTime: String,
        }]
    }],
    mainFolderId: String,
    currentvideoRoomId: String,
    currentvideoRoomLink: String,
    videoRoomsList: [{
        videoRoomId: String,
        videoRoomLink: String,
    }]
});

// Model Creation
var ChannelData = mongoose.model('channeldata', ChannelSchema);

module.exports = ChannelData;