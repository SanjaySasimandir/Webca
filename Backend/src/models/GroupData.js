// Accessing Mongoose Package
const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb+srv://bladerunner:bladerunner@clustertopgear.8ok4c.mongodb.net/Valkyrie?retryWrites=true&w=majority');

// Schema Definition
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: String,
    channels: [{
        channelName: String,
        channelID: String,
        channelOpenness: String,
        channelPicture: String,
    }],
    creationDetails: {
        creatorName: String,
        creatorUsername: String,
        creatorID: String,
        creationTime: String
    },
    members: [{
        username: String,
        fullname: String,
        id: String,
        online: Boolean,
        role: String,
        picture: String
    }],
    description: String,
    picture: String,
    openness: String,
    inviteString: String,
    mainChannelId: String
});

// Model Creation
var GroupData = mongoose.model('groupdata', GroupSchema);

module.exports = GroupData;