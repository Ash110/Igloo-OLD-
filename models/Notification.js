const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationModel = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    sentTime: {
        type: Date,
        required: true,
        default: new Date()
    },
    notificationSenderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notificationSenderUsername : {
        type : String, 
        required : true
    },
    notificationSenderName:{
        type : String,
        required : true
    },
    parentPost :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }
});

module.exports = Notification = mongoose.model('Notification', NotificationModel);