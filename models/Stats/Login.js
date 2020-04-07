const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LoginModel = new Schema({
    ipAddress : {
        type : String,
        required : true
    },
    time : {
        type : Date,
        default : new Date(),
        required : true
    }
});

module.exports = LoginStat = mongoose.model('LoginStat', LoginModel);