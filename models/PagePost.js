const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PagePostModel = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    page: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        required : true
    },
    isText: {
        type: Boolean,
        required: true
    },
    image: {
        type: String,
    },
    disableComments: {
        type: Boolean,
    },
    caption: {
        type: String,
    },
    postType:{
        type : String,
        required:true,
        default : "pagePost"
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    publishTime: {
        type: Date,
        required: true,
        default: new Date()
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

module.exports = PagePost = mongoose.model('PagePost', PagePostModel);