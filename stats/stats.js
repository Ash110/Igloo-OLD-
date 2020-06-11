const express = require('express');
const config = require('config');
const fs = require('fs');
const LoginStat = require('../models/Stats/Login');
const PageVisit = require('../models/Stats/PageVisit');

// const router = express.Router();

const newLogin = async(ipAddress) => {
    let loginStat = new LoginStat({
        ipAddress,
        time : new Date()
    });
    await loginStat.save()
}

const newPageVisit = async (ipAddress) => {
    let pageVisit = new PageVisit({
        ipAddress,
        time: new Date()
    });
    await pageVisit.save()
}

module.exports = {
    newLogin,
    newPageVisit
}

