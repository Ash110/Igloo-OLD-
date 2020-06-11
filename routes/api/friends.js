const express = require('express');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Group = require('../../models/Group');
const Notification = require('../../models/Notification');
const { sendFriendRequestMail } = require('../../email/email');


const router = express.Router();

//@route   /api/friends/getProfile
//@desc    Fetch profile details of a user
//access   Private
router.post('/getProfile', auth, async (req, res) => {
    if (req.body.username) {
        const profileUsername = req.body.username.toLowerCase();
        try {
            const user = await User.findOne({ username: profileUsername }).populate('pages', 'name username');
            if (user) {
                if (user._id.toString() === req.id) {
                    res.status(200).send("Same");
                } else {
                    const currentUser = await User.findById(req.id);
                    const { id, name, username, profilePicture, bio, telegramUsername } = user;
                    const isFriend = currentUser.friends.includes(id);
                    const isMuted = currentUser.mutedUsers.includes(id.toString())
                    const isRequested = user.requests.includes(req.id);
                    const hasRequestedMe = currentUser.requests.includes(id);
                    const numberOfFriends = user.friends.length;
                    const pages = user.pages || [];
                    res.status(200).json({ id, name, username, profilePicture, isMuted, hasRequestedMe, telegramUsername, bio, isFriend, isRequested, numberOfFriends, exists: true, pages });
                }
            } else {
                res.status(200).json({ exists: false });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error");
        }
    } else {
        res.status(400).send("No username");
    }
});

//@route   /api/friends/sendRequest
//@desc    Send a friend request
//access   Private
router.post('/sendRequest', auth, async (req, res) => {
    if (req.body.username) {
        const profileUsername = req.body.username.toLowerCase();
        const user = await User.findOne({ username: profileUsername });
        try {
            let requests = [...user.requests, req.id];
            if (user.emailPreferences.friendRequestEmails) {
                const sender = await User.findById(req.id);
                sendFriendRequestMail(user.email, user.username, sender.name);
            }
            await user.updateOne({ requests, newNotifications: true });
            res.status(200).send("Request Sent!");
        } catch (err) {
            console.log(err);
            res.status(401).send("Failed");
        }
    } else {
        res.status(401).send("Failed");
    }
});

//@route   /api/friends/removeRequest
//@desc    Remove the request
//access   Private
router.post('/removeRequest', auth, async (req, res) => {
    if (req.body.username) {
        const profileUsername = req.body.username.toLowerCase();
        const user = await User.findOne({ username: profileUsername });
        try {
            let requests = [...user.requests];
            let index = -1;
            for (let i = 0; i < requests.length; i++) {
                let item = requests[i];
                if (item == req.id) {
                    index = i;
                }
            }
            console.log(index)
            if (index > -1) {
                requests.splice(index, 1);
            }
            await user.updateOne({ requests });
            try {
                // const testUser = await User.findOne({ username: profileUsername }).populate('requests', 'name username profilePicture')
                res.status(200).send("Request Removed!");
            } catch (err) {
                console.log(err);
                res.status(401).send("Failed");
            }
        } catch (err) {
            console.log(err);
            res.status(401).send("Failed");
        }
    } else {
        res.status(401).send("Failed");
    }
});

//@route   /api/friends/remainingRequests
//@desc    List the request
//access   Private
router.post('/remainingRequests', auth, async (req, res) => {
    const user = await User.findById(req.id).populate('requests', 'name username profilePicture');
    try {
        let requests = [...user.requests];
        res.status(200).json({ requests });
    } catch (err) {
        console.log(err);
        res.status(401).send("Error fetching requests");
    }
});

//@route   /api/friends/acceptRequest
//@desc    Accept a request 
//access   Private 
router.post('/acceptRequest', auth, async (req, res) => {
    //User is the person accepting, user2 is the one who sent it
    const user = await User.findById(req.id);
    const user2 = await User.findById(req.body.accepted);
    try {
        const friends = [...user.friends, req.body.accepted];
        const friends2 = [...user2.friends, req.id];
        let notification = new Notification({
            user: user2._id,
            type: "accepted friend",
            sentTime: new Date(),
            notificationSenderId: user._id,
            notificationSenderUsername: user.username,
            notificationSenderName: user.name,
        })
        await notification.save();
        let userNotifications = [...user2.notifications];
        userNotifications.unshift(notification);
        let userFeed = [...user.feed];
        let user2Feed = [...user2.feed];
        user.posts.map((post) => {
            user2Feed.push(post)
        })
        user2.posts.map((post) => {
            userFeed.push(post)
        })
        await user.updateOne({ friends, feed : userFeed });
        await user2.updateOne({ friends: friends2, notifications: userNotifications, newNotifications: true, feed : user2Feed });
        //Remove the request from the list 
        let requests = [...user.requests];
        let index = -1;
        for (let i = 0; i < requests.length; i++) {
            let item = requests[i];
            if (item == req.body.accepted) {
                index = i;
            }
        }
        console.log(index)
        if (index > -1) {
            requests.splice(index, 1);
        }
        try {
            await user.updateOne({ requests });
        } catch (err) {
            console.log(err);
            res.status(401).send("Failed to update requests array");
        }
        //Update the all friends group for both users with new friend
        let group1 = user.groups[0]
        group1 = await Group.findById(group1);
        let group2 = user2.groups[0]
        group2 = await Group.findById(group2);
        group1members = [...group1.members];
        group1members.push(req.body.accepted);
        group2members = [...group2.members];
        group2members.push(req.id);
        try {
            await group1.updateOne({ members: group1members });
            await group2.updateOne({ members: group2members });
        } catch (err) {
            console.log(err);
            res.status(401).send("Failed to update all friends group");
        }
        res.status(200).send("Friends Added!");
    } catch (err) {
        console.log(err);
        res.status(401).send("Error Adding Friend. Please try again!");
    }
});

//@route   /api/friends/rejectRequest
//@desc    Reject a request 
//access   Private
router.post('/rejectRequest', auth, async (req, res) => {
    const user = await User.findById(req.id);
    try {
        let requests = [...user.requests];
        let index = -1;
        for (let i = 0; i < requests.length; i++) {
            let item = requests[i];
            if (item == req.body.rejected) {
                index = i;
            }
        }
        if (index > -1) {
            requests.splice(index, 1);
        }
        await user.updateOne({ requests });
        try {
            // const testUser = await User.findOne({ username: profileUsername }).populate('requests', 'name username profilePicture')
            res.status(200).send("Request Removed!");
        } catch (err) {
            console.log(err);
            res.status(401).send("Failed");
        }
    } catch (err) {
        console.log(err);
        res.status(401).send("Failed");
    }
});

//@route   /api/friends/removeFriend
//@desc    Remove a friend from all groups
//access   Private
router.post('/removeFriend', auth, async (req, res) => {
    if (req.body.username) {
        try {
            const user1 = await User.findById(req.id);
            const user2 = await User.findOne({ username: req.body.username.toLowerCase() })
            if (user1 && user2) {
                await User.updateOne({ _id: user1._id }, { "$pull": { "friends": user2._id } }, { safe: true, multi: true }, function (err, obj) {
                    // console.log(obj);
                });
                await User.updateOne({ _id: user2._id }, { "$pull": { "friends": user1._id } }, { safe: true, multi: true }, function (err, obj) {
                    // console.log(obj);
                });
                user1.groups.map(async (group) => {
                    await Group.updateOne({ _id: group }, { "$pull": { "members": user2._id } }, { safe: true, multi: true }, function (err, obj) {
                        // console.log(obj);
                    });
                });
                user2.groups.map(async (group) => {
                    await Group.updateOne({ _id: group }, { "$pull": { "members": user1._id } }, { safe: true, multi: true }, function (err, obj) {
                        // console.log(obj);
                    });
                });
                user2.posts.map(async (post) => {
                    await User.updateOne({ _id: user1._id }, { "$pull": { "feed": post._id } }, { safe: true, multi: true }, function (err, obj) {
                        // console.log(obj);
                    });
                });
                user1.posts.map(async (post) => {
                    await User.updateOne({ _id: user2._id }, { "$pull": { "feed": post._id } }, { safe: true, multi: true }, function (err, obj) {
                        // console.log(obj);
                    });
                });
                console.log("Successfully Removed");
                res.status(200).send("Success!");
            } else {
                res.status(401).send("Failed");
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }else{
        res.status(400).send("No username");
    }
});

//@route   /api/friends/getFriendsList
//@desc    Get entire friends list
//access   Private
router.post('/getFriendsList', auth, async (req, res) => {
    try {
        const user = await User.findById(req.body.id).populate('friends', '_id name username');
        if (user) {
            res.status(200).send(user.friends)
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;