const express = require('express');
const config = require('config');
const fs = require('fs');
const LoginStat = require('../models/Stats/Login');

// const router = express.Router();

const newLogin = async(ipAddress) => {
    let loginStat = new LoginStat({
        ipAddress,
        time : new Date()
    });
    await loginStat.save()
}

module.exports = {
    newLogin
}

