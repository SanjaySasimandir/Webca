// Accessing Mongoose Package
const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb+srv://bladerunner:bladerunner@clustertopgear.8ok4c.mongodb.net/Valkyrie?retryWrites=true&w=majority');

// Schema Definition
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    fullName: String,
    email: String,
    password: String,
    lastOnline: String,
    bio: String,
    picture: String,
    groups: [{
        groupname: String,
        groupid: String,
        grouppicture: String,
        grouprole: String,
        channels: [{
            channelname: String,
            channelid: String,
            channelpicture: String,
            channelrole: String,
        }]
    }]
});

// Model Creation
var UserData = mongoose.model('userdata', UserSchema);

module.exports = UserData;