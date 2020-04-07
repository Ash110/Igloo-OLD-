const express = require('express');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Group = require('../../models/Group');
const Post = require('../../models/Post');


const router = express.Router();

//@route   /api/feed/getSearchResults
//@desc    Get Search Results
//access   Private

router.post('/getSearchResults', auth, async (req, res) => {
    if(req.body.name!=""){
        console.log(req.body.name)
        if(req.body.name[0]==='@' && req.body.name.length>1){
            try {
                const results = await User.find({ username: { $regex: req.body.name.slice(1, req.body.name.length), $options: '-i' } }, 'id name username');
                res.status(200).send(results.slice(0, 20));
            } catch (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }else{
            try {
                const results = await User.find({ name: { $regex: req.body.name, $options: '-i' } }, 'id name username');
                res.status(200).send(results.slice(0, 20));
            } catch (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
    }else{
        res.status(200).send([]);
    }   
});



module.exports = router;