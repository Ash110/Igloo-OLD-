const express = require('express');
// const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Group = require('../../models/Group');
const Post = require('../../models/Post');
const PagePost = require('../../models/PagePost');
const Comment = require('../../models/Comment');
const Notification = require('../../models/Notification');
const ObjectId = require('mongoose').Types.ObjectId;

const router = express.Router();

router.get('/', (req, res) => res.send("Sample Post"));


//@route   /api/posts/newpost
//@desc    Create a new post
//access   Private

router.post('/newPost', auth, async (req, res) => {
    const user = await User.findById(req.id);
    const { isText, image, caption, groups, disableComments } = req.body;
    let imageFile = image.replace(/^data:image\/jpeg;base64,/, "");
    imageFile = imageFile.replace(/^data:image\/png;base64,/, "");
    saveTo = path.join(__dirname, '../../images/Posts/' + req.id + "_" + new Date().getTime() + ".jpeg");
    fs.writeFile(saveTo, imageFile, 'base64', async (error) => {
        if (error) console.error(error);
        else {
            const publishTime = new Date()
            let post = new Post({
                author: user.id,
                isText,
                image: saveTo,
                caption,
                permission: groups,
                publishTime,
                sharing: "Private",
                isTemp : false,
                disableComments
            });
            try {
                var sharing = "Private"
                await post.save();
                let posts = [...user.posts, post]
                await user.updateOne({ posts });
                var flag = 0;
                await groups.map(async (group, index) => {
                    let selectedGroupsMembers = await Group.findById(group._id);
                    if (selectedGroupsMembers.name === "All Followers") {
                        sharing = "Public"
                    }
                    selectedGroupsMembers = selectedGroupsMembers.members;
                    selectedGroupsMembers.map(async (selectedMember) => {
                        const member = await User.findById(selectedMember);
                        if(member){
                            updatedFeed = [...member.feed];
                            if (!updatedFeed.includes(post.id)) {
                                updatedFeed.unshift(post);
                                await member.updateOne({ feed: updatedFeed });
                            }
                        }
                    });
                    if (index === (groups.length - 1)) {
                        flag = 1;
                    }
                });
                setInterval(async () => {
                    if (flag) {
                        flag = 0;
                        await post.updateOne({ sharing });
                        res.status(200).send("Successfully Posted")
                    }
                }, 500);
            } catch (err) {
                console.log(err);
                res.status(500).send("Server Error")
            }
        }
    });
});

//@route   /api/posts/newTempPost
//@desc    Create a new post
//access   Private

router.post('/newTempPost', auth, async (req, res) => {
    const user = await User.findById(req.id);
    const { isText, image, caption, groups } = req.body;
    if (isText) {
        const user = await User.findById(req.id);
        const { isText, caption, groups } = req.body;
        const publishTime = new Date()
        let post = new Post({
            author: user.id,
            isText,
            caption,
            permission: groups,
            publishTime,
            sharing: "Private",
            isTemp : true,
        });
        try {
            var sharing = "Private"
            await post.save();
            let posts = [...user.posts, post]
            await user.updateOne({ posts });
            var flag = 0;
            await groups.map(async (group, index) => {
                let selectedGroupsMembers = await Group.findById(group._id);
                if (selectedGroupsMembers.name === "All Followers") {
                    sharing = "Public"
                }
                selectedGroupsMembers = selectedGroupsMembers.members;
                selectedGroupsMembers.map(async (selectedMember) => {
                    const member = await User.findById(selectedMember);
                    if(member){
                        updatedFeed = [...member.feed];
                        if (!updatedFeed.includes(post.id)) {
                            updatedFeed.unshift(post);
                            await member.updateOne({ feed: updatedFeed });
                        }
                    }
                });
                if (index === (groups.length - 1)) {
                    flag = 1;
                }
            });
            setInterval(async () => {
                if (flag) {
                    flag = 0;
                    await post.updateOne({ sharing });
                    res.status(200).send("Successfully Posted")
                }
            }, 500);
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error")
        }
    }
    else {
        let imageFile = image.replace(/^data:image\/jpeg;base64,/, "");
        imageFile = imageFile.replace(/^data:image\/png;base64,/, "");
        saveTo = path.join(__dirname, '../../images/Posts/' + req.id + "_" + new Date().getTime() + ".jpeg");
        fs.writeFile(saveTo, imageFile, 'base64', async (error) => {
            if (error) console.error(error);
            else {
                const publishTime = new Date()
                let post = new Post({
                    author: user.id,
                    isText,
                    image: saveTo,
                    caption,
                    permission: groups,
                    publishTime ,
                    sharing: "Private",
                    isTemp : true
                });
                try {
                    var sharing = "Private"
                    await post.save();
                    let posts = [...user.posts, post]
                    await user.updateOne({ posts });
                    var flag = 0;
                    await groups.map(async (group, index) => {
                        let selectedGroupsMembers = await Group.findById(group._id);
                        if (selectedGroupsMembers.name === "All Followers") {
                            sharing = "Public"
                        }
                        selectedGroupsMembers = selectedGroupsMembers.members;
                        selectedGroupsMembers.map(async (selectedMember) => {
                            const member = await User.findById(selectedMember);
                            if(member){
                                updatedFeed = [...member.feed];
                                if (!updatedFeed.includes(post.id)) {
                                    updatedFeed.unshift(post);
                                    await member.updateOne({ feed: updatedFeed });
                                }
                            }
                        });
                        if (index === (groups.length - 1)) {
                            flag = 1;
                        }
                    });
                    setInterval(async () => {
                        if (flag) {
                            flag = 0;
                            await post.updateOne({ sharing });
                            res.status(200).send("Successfully Posted")
                        }
                    }, 500);
                } catch (err) {
                    console.log(err);
                    res.status(500).send("Server Error")
                }
            }
        });
    }
});


//@route   /api/posts/getPostImage
//@desc    Get Post Image
//access   Private
base64_encode = (file) => {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
router.post('/getPostImage', auth, async (req, res) => {
    const post = await Post.findById(req.body.imageId);
    const saveTo = path.join(__dirname, '../../images/Posts/');
    try {
        var imageName = (post.image.split('/'));
        imageName = imageName[imageName.length - 1];
        // console.log(post.image);
        res.status(200).sendFile(imageName, { root: saveTo });
        // res.status(200).send(base64_encode(post.image));
    } catch (err) {
        console.log("Error be happening");
        console.log(err);
        res.status(500).send("Server Error");
    }
})

//@route   /api/posts/getPostDetails
//@desc    Get Post Details
//access   Private

router.post('/getPostDetails', auth, async (req, res) => {
    if (!req.body.isTemp) {
        const post = await Post.findById(req.body.postId).populate('author', 'name username');
        if (post) {
            var isAuthor = false;
            if (req.id.toString() === post.author._id.toString()) {
                isAuthor = true
            }
            var liked = false;
            if (post.likes.includes(req.id)) {
                liked = true;
            }
            res.status(200).json({ post, liked, isAuthor });
        }
    } else {
        if(req.body.isText){
            const post = await Post.findById(req.body.postId).populate('author', 'name username');
            if (post) {
                const a = new Date(post.publishTime);
                const b = new Date()
                if ((b - a) < 86400000) {
                    var isAuthor = false;
                    if (req.id.toString() === post.author._id.toString()) {
                        isAuthor = true
                    }
                    var liked = false;
                    if (post.likes.includes(req.id)) {
                        liked = true;
                    }
                    res.status(200).json({ post, liked, valid: true, isAuthor, isText : true });
                } else {
                    res.status(200).json({ valid: false });
                }
            }
        }else{
            const post = await Post.findById(req.body.postId).populate('author', 'name username');
            if (post) {
                const a = new Date(post.publishTime);
                const b = new Date()
                if ((b - a) < 86400000) {
                    var isAuthor = false;
                    if (req.id.toString() === post.author._id.toString()) {
                        isAuthor = true
                    }
                    var liked = false;
                    if (post.likes.includes(req.id)) {
                        liked = true;
                    }
                    res.status(200).json({ post, liked, valid: true, isAuthor, isText: false });
                } else {
                    res.status(200).json({ valid: false });
                }
            }
        }
    }
});

//@route   /api/posts/likePost
//@desc    Like a post
//access   Private

router.post('/likePost', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.body.postId);
        let likes = [...post.likes];
        likes.push(req.id);
        const user = await User.findById(post.author);
        const sender = await User.findById(req.id);
        if (user && sender) {
            let notification = new Notification({
                user: user._id,
                type: "liked",
                sentTime: new Date(),
                notificationSenderId: req.id,
                notificationSenderUsername : sender.username,
                notificationSenderName: sender.name,
                parentPost: req.body.postId
            })
            await notification.save();
            let userNotifications = [...user.notifications];
            userNotifications.unshift(notification);
            await user.updateOne({ notifications: userNotifications, newNotifications: true });
        }
        await post.updateOne({ likes });
        res.status(200).send("Post Liked!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/posts/unlikePost
//@desc    Unlike a post
//access   Private
router.post('/unlikePost', auth, async (req, res) => {
    // const post = await Post.findById(req.body.postId);
    // let likes = [...post.likes];
    // for (let i = 0; i < likes.length; i++) {
    //     if (likes[i].toString() === req.id.toString()) {
    //         likes.splice(i, 1);
    //     }
    // }
    try {
        await Post.findOneAndUpdate({ _id: req.body.postId }, { $pull: { "likes": req.id } });
        // await post.updateOne({ likes });
        res.status(200).send("Post Unliked!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/posts/getPostGrid
//@desc    Get the grid of posts
//access   Private
router.post('/getPostGrid', auth, async (req, res) => {
    if (req.body.owner) {
        try {
            const user = await User.findById(req.id).populate('posts', 'likes publishTime isText isTemp');
            userPosts = []
            user.posts.map((post) => {
                if (!post.isText) {
                    userPosts.push({ id: post._id, likes: post.likes.length, time: post.publishTime, isTemp : post.isTemp });
                }
            });
            res.status(200).send(userPosts);
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error");
        }
    } else {
        const user = await User.findOne({ username: req.body.user }).populate('posts', 'id permission isText isTemp');
        var posts = new Set();
        var flag = 0;
        try {
            user.posts.map((post, index) => {
                //For each post, get the groups
                post.permission.map(async (groupId, index) => {
                    //In each group, get the members and see if the user is a part of it
                    const group = await Group.findById(groupId).populate('members', 'id');
                    group.members.map((member, index) => {
                        if (member._id.toString() === req.id.toString()) {
                            if (!post.isText) {
                                posts.add({id : post._id, isTemp : post.isTemp});
                            }
                        }
                    })
                });
                if (index === user.posts.length - 1) {
                    flag = 1;
                }
            });
            setInterval(() => {
                if (flag) {
                    flag = 0;
                    res.status(200).send([...posts]);
                }
            }, 500)
        }
        catch (err) {
            console.log(err);
            res.send("Server Error").status(500);
        }
    }
});

//@route   /api/posts/getFullPostDetails
//@desc    Get Post Details
//access   Private

router.post('/getFullPostDetails', auth, async (req, res) => {
    if (ObjectId.isValid(req.body.postId)){
        const post = await Post.findById(req.body.postId).populate('author', 'name username');
        if (post) {
            var isAuthor = false;
            if (req.id.toString() === post.author._id.toString()) {
                isAuthor = true;
            }
            if (!post.isTemp) {
                var liked = false;
                if (post.likes.includes(req.id)) {
                    liked = true;
                }
                var flag = 0;
                var allMembers = [];
                post.permission.map(async (groupId, index) => {
                    const group = await Group.findById(groupId);
                    group.members.map((member) => {
                        allMembers.push(member.toString());
                    });
                    if (index === post.permission.length - 1) {
                        flag = 1;
                    }
                })
                setInterval(() => {
                    if (flag) {
                        if (allMembers.includes(req.id)) {
                            flag = 0;
                            res.status(200).json({ post, liked, permission: true, isText: false, isAuthor, isTemp: false });
                        } else {
                            flag = 0;
                            res.status(200).json({ permission: false, isTemp: false });
                        }
                    }
                }, 500);
            } else {
                if (!post.isText) {
                    const a = new Date(post.publishTime);
                    const b = new Date()
                    if ((b - a) < 86400000) {
                        var liked = false;
                        if (post.likes.includes(req.id)) {
                            liked = true;
                        }
                        var flag = 0;
                        var allMembers = [];
                        post.permission.map(async (groupId, index) => {
                            const group = await Group.findById(groupId);
                            group.members.map((member) => {
                                allMembers.push(member.toString());
                            });
                            if (index === post.permission.length - 1) {
                                flag = 1;
                            }
                        })
                        setInterval(() => {
                            if (flag) {
                                if (allMembers.includes(req.id)) {
                                    flag = 0;
                                    res.status(200).json({ post, liked, permission: true, isText: false, valid: true, isTemp: true, isAuthor });
                                } else {
                                    flag = 0;
                                    res.status(200).json({ permission: false });
                                }
                            }
                        }, 500);
                    } else {
                        res.status(200).json({ valid: false, permission: true, isText: false, isTemp: true });
                    }
                } else {
                    const a = new Date(post.publishTime);
                    const b = new Date()
                    if ((b - a) < 86400000) {
                        var liked = false;
                        if (post.likes.includes(req.id)) {
                            liked = true;
                        }
                        var flag = 0;
                        var allMembers = [];
                        post.permission.map(async (groupId, index) => {
                            const group = await Group.findById(groupId);
                            group.members.map((member) => {
                                allMembers.push(member.toString());
                            });
                            if (index === post.permission.length - 1) {
                                flag = 1;
                            }
                        })
                        setInterval(() => {
                            if (flag) {
                                if (allMembers.includes(req.id)) {
                                    flag = 0;
                                    res.status(200).json({ post, liked, permission: true, isText: true, isTemp: true, valid: true, isAuthor });
                                } else {
                                    flag = 0;
                                    res.status(200).json({ permission: false, isText: true, isTemp: true });
                                }
                            }
                        }, 500);
                    } else {
                        res.status(200).json({ valid: false, permission: true, isText: true, isTemp: true });
                    }
                }
            }
        } else {
            res.status(200).json({ valid: false, permission: true, isTemp: true })
        }
    }else{
        res.status(200).json({ valid: false, permission: true, isTemp: true })
    }
});


//@route   /api/posts/deletePost
//@desc    Delete a post
//access   Private

router.post('/deletePost', auth, async (req, res) => {
    const postId = req.body.postId;
    const post = await Post.findById(postId);
    try {
        if (post) {
            if (req.id.toString() === post.author.toString()) {
                await User.updateOne({ _id: post.author }, { $pull: { posts: postId } })
                console.log("Deleting ",post.image);
                const path = post.image;
                try {
                    fs.unlinkSync(path)
                    //file removed
                } catch (err) {
                    console.error(err)
                }
                await Post.findOneAndDelete({ _id: postId });
                res.status(200).json({ messsage: "Success", valid: 1 })
            } else {
                res.status(200).json({ messsage: "No permission", valid: 0 })
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/posts/getLikes
//@desc    Get likes on post or comment
//access   Private

router.post('/getLikes', auth, async (req, res) => {
    const {id, type } = req.body;
    try {
        if(type==="comment"){
            const comment =  await Comment.findById(id).populate('likes', 'name username _id')
            if(comment){
                res.status(200).send(comment.likes)
            }else{
                res.status(404).send("Comment not found")
            }
        }
        else if (type === "post") {
            const post = await Post.findById(id).populate('likes', 'name username _id')
            if (post) {
                res.status(200).send(post.likes)
            } else {
                res.status(404).send("Post not found")
            }
        }else if (type=="pagepost"){
            const post = await PagePost.findById(id).populate('likes', 'name username _id')
            if (post) {
                res.status(200).send(post.likes)
            } else {
                res.status(404).send("Post not found")
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;