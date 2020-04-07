const express = require('express');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Group = require('../../models/Group');
const Post = require('../../models/Post');
const PagePost = require('../../models/PagePost');


const router = express.Router();

//@route   /api/feed/getFeed
//@desc    Fetch the feed
//access   Private

router.post('/getFeed', auth, async (req, res) => {
    const user = await User.findById(req.id);
    const feed = user.feed;
    let mutedUsers = user.mutedUsers;
    var flag = 0;
    let allFeedPosts = []
    if (feed.length === 0) {
        try {
            flag = -1;
            res.status(200).json({ allFeedPosts, userId: req.id });
        } catch (err) {
            flag = 0;
            console.log("Error in /getFeed");
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
    for (let i = 0; i < feed.length; i++) {
        const post = await Post.findById(feed[i]).populate('permission', 'members');
        // let allMembers = []
        if (post) {
            if (!mutedUsers.includes(post.author.toString())) {
                if (post.permission.filter(x => req.id.toString() === x._id.toString())) {
                    if (post.isText) {
                        const a = new Date(post.publishTime);
                        const b = new Date()
                        if ((b - a) < 86400000) {
                            const { _id, isText, isTemp } = post;
                            const sendPost = {
                                id: _id,
                                isText,
                                isTemp,
                            }
                            allFeedPosts.push(sendPost);
                        }
                    } else {
                        const { _id, isText, isTemp } = post;
                        const sendPost = {
                            id: _id,
                            isText,
                            isTemp,
                            isPagePost : false
                        }
                        allFeedPosts.push(sendPost);
                    }
                } else {
                    console.log("Post is not valid");
                }
            }
        } else {
            const post = await PagePost.findById(feed[i]).populate('author', 'name username');
            // let allMembers = []
            if (post) {
                if (!mutedUsers.includes(post.author.username.toString())) {
                    const { _id, isText } = post;
                    const sendPost = {
                        id: _id,
                        isText,
                        isPagePost:true
                    }
                    allFeedPosts.push(sendPost);
                }
            } else {
                console.log("Post is not valid");
            }
        }
        flag++;
    }
    setInterval(() => {
        if (flag === feed.length) {
            try {
                flag = 0;
                res.status(200).json({ allFeedPosts, userId: req.id });
            } catch (err) {
                flag = 0;
                console.log(err);
                console.log("Error in /getFeed");
                res.status(500).send("Internal Server Error");
            }
        }
    }, 500)
});



module.exports = router;





// feed.forEach(async (postId, index) => {
    //     const post = await Post.findById(postId).populate('permission', 'members');
    //     // let allMembers = []
    //     if (post) {
    //         if (post.permission.filter(x => req.id.toString() === x._id.toString())) {
    //             if (post.isText) {
    //                 const a = new Date(post.publishTime);
    //                 const b = new Date()
    //                 if ((b - a) < 86400000) {
    //                     const { _id, isText } = post;
    //                     const sendPost = {
    //                         id: _id,
    //                         isText
    //                     }
    //                     allFeedPosts.push(sendPost);
    //                 }
    //             } else {
    //                 const { _id, isText } = post;
    //                 const sendPost = {
    //                     id: _id,
    //                     isText
    //                 }
    //                 allFeedPosts.push(sendPost);
    //             }
    //         } else {
    //             console.log("Post is not valid");
    //         }
    //         // post.permission.map((post) => {
    //         //     post.members.map((member) => {
    //         //         allMembers.push(member.toString())
    //         //     })
    //         // })
    //         // if (allMembers.includes(req.id.toString())) {
    //         //     const { _id, isText } = post;
    //         //     const sendPost = {
    //         //         id: _id,
    //         //         isText
    //         //     }
    //         //     allFeedPosts.push(sendPost);
    //         // }
    //     }
    //     if (index === (feed.length - 1)) {
    //         flag = 1;
    //     }
    // });