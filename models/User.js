const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserModel = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    dateOfBirth:{
        type:Date,
    },
    profilePicture:{
        type:String,
        required:true,
        default:"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png"
    },
    bio:{
        type:String
    },
    mutedUsers : [{
        type : String
    }],
    accountType: {
        type: String,
        required: true
    },
    lastActive:{
        type:Date,
        required:true,
        default:new Date()
    },
    newNotifications:{
        type : Boolean,
        default : false
    },
    notifications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    passwordReset : {
        code : {
            type : String,
        },
        sendDate : {
            type : Date,
        }
    },
    isVerified : {
        type : Boolean,
        // required : true
    },
    feed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    groups:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    }],
    stories:[],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    emailPreferences : {
        friendRequestEmails : {
            type : Boolean,
            default : true
        },
        newsletterEmails : {
            type : Boolean,
            default : true
        }
    },
    telegramUsername : {
        type : String,
        default : null
    },
    pages : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
    }],
    subscribedPages : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
    }]
});

module.exports = User = mongoose.model('User', UserModel);