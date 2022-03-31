// Accessing Mongoose Package
const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb+srv://bladerunner:bladerunner@clustertopgear.8ok4c.mongodb.net/Valkyrie?retryWrites=true&w=majority');

// Schema Definition
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    channelName: String,
    channelID: String,
    messages: [{
        messageType: String,
        message: String,
        messageSender: {
            username: String,
            fullname: String,
            id: String,
        },
        messageTime: String,
    }]

});

// Model Creation
var MessageData = mongoose.model('messagedata', MessageSchema);

module.exports = MessageData;