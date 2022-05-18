// Accessing Mongoose Package
const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb+srv://bladerunner:bladerunner@clustertopgear.8ok4c.mongodb.net/Valkyrie?retryWrites=true&w=majority');

// Schema Definition
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    name: String,
    author: String,
    uploadDate: String,
    filelocation: String,
    filetype: String,
});

const FolderSchema = new Schema({
    name: String,
    author: String,
    channelid: String,
    creationDate: String,
    files: [FileSchema],
    folders: [{
        name: String,
        folderid: String,
    }]
});



// Model Creation
var FolderData = mongoose.model('folderdata', FolderSchema);

module.exports = FolderData;