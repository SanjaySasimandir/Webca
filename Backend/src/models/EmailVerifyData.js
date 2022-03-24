const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bladerunner:bladerunner@clustertopgear.8ok4c.mongodb.net/Valkyrie?retryWrites=true&w=majority');

const Schema = mongoose.Schema;

const EmailVerifySchema = new Schema({
    email: String,
    otp: String
});

var EmailVerifyData = mongoose.model('emailverifydata', EmailVerifySchema);

module.exports = EmailVerifyData;