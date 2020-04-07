const express = require('express');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Group = require('../../models/Group');
const Post = require('../../models/Post');


const router = express.Router();

//@route   /api/notifications/checkNewNotifications
//@desc    Check if there are new notifications
//access   Private

router.post('/checkNewNotifications', auth, async (req, res) => {
    try {
        const user = await User.findById(req.id);
        if (user) {
            if (user.newNotifications){
                res.status(200).send(true);
            }else{
                res.status(200).send(false)
            }
        }else{
            res.status(404).send("User not found")
        }   
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Error")
    }
});

//@route   /api/notifications/getNotifications
//@desc    Get all the notifications
//access   Private

router.post('/getNotifications', auth, async (req, res) => {
    try {
        const user = await User.findById(req.id).populate('notifications', 'user notificationSenderId notificationSenderUsername notificationSenderName type sentTime parentPost');
        if (user) {
            await user.updateOne({ newNotifications: false });
            res.status(200).send(user.notifications);
        } else {
            console.log("Not found in /getNotifications")
            res.status(200).send("User not found");
        }
    } catch (err) {
        console.log("error in /getNotifications");
        console.log(err);
        res.status(500).send("Internal Error");
    }
});



module.exports = router;