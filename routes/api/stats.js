
const express = require('express');
const { newPageVisit } = require('../../stats/stats')

const router = express.Router();

//@route   /api/stats/pageVisit
//@desc    Add a new page visit
//access   Public

router.post('/pageVisit', async (req, res) => {
    res.status(200);
    newPageVisit(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
});

module.exports = router;