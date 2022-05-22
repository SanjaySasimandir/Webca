// Accessing Mongoose Package
const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb+srv://bladerunner:bladerunner@clustertopgear.8ok4c.mongodb.net/Valkyrie?retryWrites=true&w=majority');

// Schema Definition
const Schema = mongoose.Schema;


const VideoRoomSchema = new Schema({
    channelid: String,
    videoRoomLink: String,
    creationDate: String,
    creator: {
        username: String,
        userid: String,
    },
    activeMembers: [{
        username: String,
        userid: String,
    }],
    attendedMembers: [{
        username: String,
        userid: String,
    }],
    blockedMembers: [{
        userid: String,
    }],
});



// Model Creation
var VideoCallData = mongoose.model('videocalldata', VideoRoomSchema);

module.exports = VideoCallData;