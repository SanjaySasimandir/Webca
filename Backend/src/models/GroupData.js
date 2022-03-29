// Accessing Mongoose Package
const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb+srv://bladerunner:bladerunner@clustertopgear.8ok4c.mongodb.net/Valkyrie?retryWrites=true&w=majority');

// Schema Definition
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: String,
    uniqueName: String,
    channels: [{
        channelName: String,
        channelID: String,
    }],
    creationDetails: {
        creatorName: String,
        creatorID: String,
        creationTime: String
    },
    members: [{
        username: String,
        fullname: String,
        id: String,
        online: Boolean
    }],
    description: String,
    picture: String
});

// Model Creation
var GroupData = mongoose.model('groupdata', GroupSchema);

module.exports = GroupData;