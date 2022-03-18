// Accessing Mongoose Package
const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb+srv://bladerunner:bladerunner@clustertopgear.8ok4c.mongodb.net/Valkyrie?retryWrites=true&w=majority');

// Schema Definition
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
    username: String,
    fullName: String,
    email: String,
    password: String,
    lastOnline: Date,
    chats: Array,
    role: String
});

// Model Creation
var RegistrationData = mongoose.model('registrationdata', RegistrationSchema);

module.exports = RegistrationData;