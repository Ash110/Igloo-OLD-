const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PageVisitModel = new Schema({
    ipAddress: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: new Date(),
        required: true
    }
});

module.exports = PageVisit = mongoose.model('PageVisit', PageVisitModel);