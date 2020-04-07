const express = require('express');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Page = require('../../models/Page');
const jwt = require('jsonwebtoken');
const config = require('config');
const path = require('path');
const fs = require('fs');
const PagePost = require('../../models/PagePost');
const ObjectId = require('mongoose').Types.ObjectId;

const router = express.Router();


//@route   /api/pages/newPage
//@desc    Create a new Page
//access   Private
router.post('/newPage', auth, async (req, res) => {
    const { pageName, pageDescription, pageUsername } = req.body;
    if(pageUsername.length <= 50){
        if (pageName && pageDescription && pageUsername && pageUsername.match(/^[a-zA-Z0-9_]+$/, 'i')) {
            try {
                let page = await Page.findOne({ username: pageUsername });
                if (!page) {
                    page = new Page({
                        name: pageName,
                        description: pageDescription,
                        username: pageUsername.toLowerCase(),
                        creator: req.id,
                        members: new Array(req.id),
                        posts: []
                    });
                    await page.save();
                    const user = await User.findById(req.id);
                    let pages = [...user.pages, page._id];
                    await user.updateOne({ pages });
                    res.status(200).send("Page successfully created!");
                } else {
                    res.status(400).send("The username is taken. Try another one.")
                }
            } catch (err) {
                console.log(err);
                res.status(500).send("Server Error");
            }
        } else {
            res.status(400).send("One of the required fields has not been filled and username can only contain alphanumericals and underscore")
        }
    }else{
        res.status(400).send("Username cannot be longer than 50 characters")
    }
});

//@route   /api/pages/getPages
//@desc    Get all user Pages
//access   Private
router.post('/getPages', auth, async (req, res) => {
    try {
        const user = await User.findById(req.id).populate('pages', 'name description username');
        res.status(200).send(user.pages);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/pages/getPageInfo
//@desc    Get a page info
//access   Public
router.post('/getPageInfo', async (req, res) => {
    try {
        const { username } = req.body
        const page = await Page.findOne({ username: username.toString().toLowerCase() }).populate('creator', 'name username');
        if(page){
            var isSubscribed = false;
            if (req.cookies.userToken) {
                const decoded = jwt.verify(req.cookies.userToken, config.get('jwtSecret'));
                //Return only the user ID if valid
                const userId = decoded.id.slice(0, decoded.id.length / 2);
                isSubscribed = page.members.some((member) => {
                    if (member.equals(userId)) return true;
                });
                console.log(isSubscribed)
            }
            res.status(200).json({ posts: page.posts, isSubscribed, creator: page.creator, description: page.description, name: page.name })
        }else{
            res.status(404).send("Page not found")
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/pages/subscribePage
//@desc    Subscribe to page
//access   Private
router.post('/subscribePage', auth, async (req, res) => {
    try {
        const { username } = req.body
        const page = await Page.findOne({ username: username.toString() });
        const user = await User.findById(req.id);
        if (page && user) {
            let subscribedPages = [...user.subscribedPages, page._id];
            let members = [...page.members, req.id];
            await page.updateOne({ members });
            await user.updateOne({ subscribedPages });
            res.status(200).send("Subscribed!")
        } else {
            res.status(404).send("Login to subscribe")
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/pages/unsubscribePage
//@desc    Unsubscribe to a page
//access   Private
router.post('/unsubscribePage', auth, async (req, res) => {
    try {
        const { username } = req.body
        const page = await Page.findOne({ username: username.toString() });
        const user = await User.findById(req.id);
        if (page && user) {
            await Page.updateOne({ _id: page._id }, { $pull: { members: req.id } })
            await User.updateOne({ _id: req.id }, { $pull: { subscribedPages: page._id } })
            res.status(200).send("Unubscribed!")
        } else {
            res.status(404).send("Login to unsubscribe")
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/pages/newPost
//@desc    Unsubscribe to a page
//access   Private
router.post('/newPost', auth, async (req, res) => {
    try {
        const { isText } = req.body;
        if (isText) {
            // const user = await User.findById(req.id);
            const { isText, caption, page, disableComments } = req.body;
            const publishTime = new Date()
            let post = new PagePost({
                author: req.id,
                page,
                isText,
                disableComments,
                caption,
                publishTime,
            });
            await post.save();
            let selectedPage = await Page.findById(page);
            let posts = [...selectedPage.posts];
            posts.unshift(post);
            await selectedPage.updateOne({ posts });
            // let posts = [...user.posts, post]
            // await user.updateOne({ posts });
            var flag = 0;
            await selectedPage.members.map(async (member, index) => {
                const selectedMember = await User.findById(member);
                console.log("Selected member is ", selectedMember);
                if (selectedMember) {
                    updatedFeed = [...selectedMember.feed];
                    updatedFeed.unshift(post);
                    await selectedMember.updateOne({ feed: updatedFeed });
                    if (index === (selectedPage.members.length - 1)) {
                        flag = 1;
                    }
                }
            });
            setInterval(async () => {
                if (flag) {
                    flag = 0;
                    res.status(200).send("Successfully Posted")
                }
            }, 500);
        } else {
            const { isText, caption, page, disableComments, image } = req.body;
            let imageFile = image.replace(/^data:image\/jpeg;base64,/, "");
            imageFile = imageFile.replace(/^data:image\/png;base64,/, "");
            saveTo = path.join(__dirname, '../../images/PagePosts/' + req.id + "_" + new Date().getTime() + ".jpeg");
            fs.writeFile(saveTo, imageFile, 'base64', async (error) => {
                if (error) console.error(error);
                else {
                    const publishTime = new Date()
                    let post = new PagePost({
                        author: req.id,
                        page,
                        isText,
                        disableComments,
                        caption,
                        publishTime,
                        image: saveTo,
                    });
                    try {
                        await post.save();
                        let selectedPage = await Page.findById(page);
                        let posts = [...selectedPage.posts];
                        posts.unshift(post);
                        await selectedPage.updateOne({ posts });
                        var flag = 0;
                        await selectedPage.members.map(async (member, index) => {
                            const selectedMember = await User.findById(member);
                            if (selectedMember) {
                                updatedFeed = [...selectedMember.feed];
                                updatedFeed.unshift(post);
                                await selectedMember.updateOne({ feed: updatedFeed });
                                if (index === (selectedPage.members.length - 1)) {
                                    flag = 1;
                                }
                            }
                        });
                        setInterval(async () => {
                            if (flag) {
                                flag = 0;
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
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error")
    }

});

//@route   /api/pages/getPostDetails
//@desc    Get a posts details
//access   Private
router.post('/getPostDetails', async (req, res) => {
    const { postId } = req.body;
    if (ObjectId.isValid(postId)) {
        try {
            const post = await PagePost.findById(postId).populate('author', 'name username _id');
            if (post) {
                const page = await Page.findById(post.page);
                let postSubmission = {
                    author: post.author.name,
                    authorUsername: post.author.username,
                    authorId: post.author._id,
                    pageName: page.name,
                    time: post.publishTime,
                    caption: post.caption,
                    isText: post.isText,
                    image: null,
                    disableComments: post.disableComments,
                    likes: post.likes,
                    comments: post.comments,
                    isAuthor: false,
                    id: post._id,
                    liked: false,
                    valid: true
                }

                if (!post.isText) {
                    postSubmission.image = post.image;
                }
                if (req.cookies.userToken) {
                    const decoded = jwt.verify(req.cookies.userToken, config.get('jwtSecret'));
                    //Return only the user ID if valid
                    const userId = decoded.id.slice(0, decoded.id.length / 2);
                    if (post.author._id.toString() === userId.toString()) {
                        postSubmission.isAuthor = true;
                    }
                    if (post.likes.includes(userId)) {
                        postSubmission.liked = true;
                    }
                }
                res.status(200).send(postSubmission);
            } else {
                res.status(404).send("Post not found")
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error")
        }
    }else{
        console.log("Not valid")
        res.status(404).send("Page not found")
    }
});

//@route   /api/pages/getPostImage
//@desc    Get Post Image
//access   Private
base64_encode = (file) => {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
router.post('/getPostImage', async (req, res) => {
    console.log(req.body.imageId);
    const post = await PagePost.findById(req.body.imageId);
    const saveTo = path.join(__dirname, '../../images/PagePosts/');
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

//@route   /api/pages/likePost
//@desc    Like a post
//access   Private

router.post('/likePost', auth, async (req, res) => {
    try {
        const post = await PagePost.findById(req.body.postId);
        let likes = [...post.likes];
        likes.push(req.id);
        const user = await User.findById(post.author);
        const sender = await User.findById(req.id);
        // if (user && sender) {
        //     let notification = new Notification({
        //         user: user._id,
        //         type: "liked",
        //         sentTime: new Date(),
        //         notificationSenderId: req.id,
        //         notificationSenderUsername: sender.username,
        //         notificationSenderName: sender.name,
        //         parentPost: req.body.postId
        //     })
        //     await notification.save();
        //     let userNotifications = [...user.notifications];
        //     userNotifications.unshift(notification);
        //     await user.updateOne({ notifications: userNotifications, newNotifications: true });
        // }
        await post.updateOne({ likes });
        res.status(200).send("Post Liked!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/pages/unlikePost
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
        await PagePost.findOneAndUpdate({ _id: req.body.postId }, { $pull: { "likes": req.id } });
        // await post.updateOne({ likes });
        res.status(200).send("Post Unliked!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/pages/getEditPageInfo
//@desc    Get a page info for editing
//access   Private
router.post('/getEditPageInfo', auth, async (req, res) => {
    try {
        const page = await Page.findById(req.body.id)
        const {name, username, description} = page;
        const memberCount = page.members.length;
        res.status(200).json({name, username, description, memberCount})
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/pages/updatePage
//@desc    Get a page info for editing
//access   Private
router.post('/updatePage', auth, async (req, res) => {
    try {
        const {name, username, description} = req.body;
        if (!(name && username && description && username.match(/^[a-zA-Z0-9_]+$/, 'i'))){
            res.status(400).send("One of the required fields has not been filled and username can only contain alphanumericals and underscore")
        }else{
            if(username.length<=50){
                const page = await Page.findById(req.body.id)
                const page2 = await Page.findOne({ username : username.toLowerCase() })
                if (!page2 || page2.username.toLowerCase() == page.username.toLowerCase()) {
                    await Page.findOneAndUpdate({ _id: req.body.id }, { name, username: username.toLowerCase(), description });
                    res.status(200).send("Success!");
                } else {
                    res.status(400).send("Username is already taken!");
                }
            }else{
                res.status(400).send("Username cannot be greater than 50 characters")
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/pages/getPageList
//@desc    Get a page info for editing
//access   Private
router.post('/getPageList', auth, async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(id).populate('pages', 'name username');
        if(user){
            if(user.pages){
                res.status(200).send(user.pages);
            }else{
                res.status(200).send([]);
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/pages/deletePost
//@desc    Delete a post
//access   Private

router.post('/deletePost', auth, async (req, res) => {
    const postId = req.body.postId;
    const post = await PagePost.findById(postId);
    try {
        if (post) {
            if (req.id.toString() === post.author.toString()) {
                await Post.updateOne({ _id: post.page }, { $pull: { posts: postId } })
                if(!post.isText){
                    console.log("Deleting ", post.image);
                    const path = post.image;
                    try {
                        fs.unlinkSync(path)
                        //file removed
                    } catch (err) {
                        console.error(err)
                    }
                }
                await PagePost.findOneAndDelete({ _id: postId });
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

// //@route   /api/pages/deletePage
// //@desc    Update the Page with members
// //access   Private
// router.post('/deletePage', auth, async (req, res) => {
//     const { pageId } = req.body;
//     try {
//         await Page.findByIdAndDelete(PageId);
//         res.status(200).send("Success!");
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Server Error");
//     }
// });

module.exports = router;