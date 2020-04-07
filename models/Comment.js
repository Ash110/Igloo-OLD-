const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentModel = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentText:{
        type:String,
        required : true
    },
    publishTime: {
        type: Date,
        required: true,
        default: new Date()
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],   
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }]
});

module.exports = Comment = mongoose.model('Comment', CommentModel);