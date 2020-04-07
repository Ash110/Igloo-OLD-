const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostModel = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isText: {
        type: Boolean,
        required: true
    },
    isTemp: {
        type: Boolean,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: "https://images.unsplash.com/photo-1569388037243-dfa034ecdbca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    },  
    disableComments : {
        type : Boolean,
    },
    caption: {
        type: String,
    },
    sharing:{
        type:String,
    },
    permission: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    }],
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

module.exports = Post = mongoose.model('Post', PostModel);