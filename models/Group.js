const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dateOfCreation: {
        type: Date,
        default: new Date()
    },
    description: {
        type: String
    },
    posts: [],
    stories: [],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

module.exports = Group = mongoose.model('Group', GroupModel);