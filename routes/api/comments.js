const express = require('express');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Post = require('../../models/Post');
const PagePost = require('../../models/PagePost');
const Comment = require('../../models/Comment');
const config = require('config');
const jwt = require('jsonwebtoken');


const router = express.Router();

//@route   /api/comments/postComment
//@desc    Add a new comment to post
//access   Private

router.post('/postComment', auth, async (req, res) => {
    const { postId, comment, type } = req.body;
    if (type === "pagePost") {
        try {
            if (comment != "") {
                const publishTime = new Date()
                let newComment = new Comment({
                    author: req.id,
                    commentText: comment,
                    publishTime,
                });
                await newComment.save();
                const post = await PagePost.findById(postId);
                let allComments = [...post.comments];
                allComments.push(newComment);
                await post.updateOne({ comments: allComments })
                res.status(200).send(newComment._id);
            } else {
                console.log("Enter value")
                res.status(500).send("Enter a non empty comment!");
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error!");
        }
    } else {
        try {
            if (comment != "") {
                const publishTime = new Date()
                let newComment = new Comment({
                    author: req.id,
                    commentText: comment,
                    publishTime,
                });
                await newComment.save();
                console.log(newComment);
                const post = await Post.findById(postId);
                const user = await User.findById(post.author);
                const sender = await User.findById(req.id);
                if (user && sender && (post.author.toString() !== req.id.toString())) {
                    let notification = new Notification({
                        user: user._id,
                        type: "commented on",
                        sentTime: new Date(),
                        notificationSenderId: req.id,
                        notificationSenderName: sender.name,
                        notificationSenderUsername: sender.username,
                        parentPost: req.body.postId
                    })
                    await notification.save();
                    let userNotifications = [...user.notifications];
                    userNotifications.unshift(notification);
                    await user.updateOne({ notifications: userNotifications, newNotifications: true });
                }
                let allComments = [...post.comments];
                allComments.push(newComment);
                await post.updateOne({ comments: allComments })
                res.status(200).send(newComment._id);
            } else {
                console.log("Enter value")
                res.status(500).send("Enter a non empty comment!");
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error!");
        }
    }
});

//@route   /api/comments/getComment
//@desc    Fetch all comments of a post
//access   Private
router.post('/getComment', async (req, res) => {
    const { commentId } = req.body;
    try {
        const comment = await Comment.findById(commentId).populate('author', 'name _id username');
        if (comment) {
            if (req.cookies.userToken) {
                const decoded = jwt.verify(req.cookies.userToken, config.get('jwtSecret'));
                //Return only the user ID if valid
                const userId = decoded.id.slice(0, decoded.id.length / 2);
                var liked = false;
                if (comment.likes.includes(userId)) {
                    liked = true;
                }
                console.log(liked);
            }
            res.status(200).json({ comment, liked, numberOfLikes: comment.likes.length });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Error");
    }
});

//@route   /api/comments/postCommentReply
//@desc    Add a new comment to post
//access   Private

router.post('/postCommentReply', auth, async (req, res) => {
    const { commentId, reply } = req.body;
    try {
        if (reply != "") {
            const publishTime = new Date()
            let newReply = new Comment({
                author: req.id,
                commentText: reply,
                publishTime,
            });
            await newReply.save();
            const parentComment = await Comment.findById(commentId);
            let allReplies = [...parentComment.replies];
            allReplies.push(newReply);
            await parentComment.updateOne({ replies: allReplies })
            res.status(200).send(newReply._id);
        } else {
            console.log("Enter value")
            res.status(500).send("Enter a non empty comment!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error!");
    }
});

//@route   /api/comments/likeComment
//@desc    Like a comment
//access   Private

router.post('/likeComment', auth, async (req, res) => {
    const comment = await Comment.findById(req.body.commentId);
    let likes = [...comment.likes];
    likes.push(req.id);
    try {
        await comment.updateOne({ likes });
        res.status(200).send("Comment Liked!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/posts/unlikeComment
//@desc    Unlike a post
//access   Private
router.post('/unlikeComment', auth, async (req, res) => {
    const comment = await Comment.findById(req.body.commentId);
    let likes = [...comment.likes];
    for (let i = 0; i < likes.length; i++) {
        console.log(likes[i]);
        if (likes[i].toString() === req.id.toString()) {
            likes.splice(i, 1);
        }
    }
    try {
        await comment.updateOne({ likes });
        res.status(200).send("Post Unliked!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;