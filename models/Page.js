const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PageModel = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    posts :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PagePost',
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    visibility:{
        type:String,
        required : true,
        default :"Public"
    },
    creationTime: {
        type: Date,
        required: true,
        default: new Date()
    },
});

module.exports = Page = mongoose.model('Page', PageModel);