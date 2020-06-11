const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Post = require('../../models/Post');
const Group = require('../../models/Group');
const { sendPasswordResetMail, sendWelcomeMail, sendNewLoginMail } = require('../../email/email');
const crypto = require('crypto');
const {newLogin} = require('../../stats/stats')

const router = express.Router();

router.get('/', (req, res) => res.send("Sample User"));

//@route   POST /api/users/register
//@desc    Register a new user
//access   Public


router.post('/register',
    [
        check('name', 'Name is Required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'The password should be atleast 6 characters long').isLength({ min: 6 }),
        check('username', 'Username cannot be empty').not().isEmpty(),
        check('username', 'Username can only contain a-z A-Z 0-9, underscore (_) and hyphen (-)').matches(/^[a-zA-Z0-9_-]+$/, 'i'),
        check('captchaValue', 'Please enter the captcha').not().isEmpty(),
    ]
    , async (req, res) => {
        const { name, email, password, confirmPassword, username, accountType } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!(password === confirmPassword)) {
            return res.status(400).json({ errors: [{ msg: 'Passwords are not the same' }] });
        }
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'An account has already been registered with this email. Do you want to login instead?' }] });
            }
            user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'Username taken! Try something else.' }] });
            }
            if (username.length >= 36) {
                return res.status(400).json({ errors: [{ msg: 'Username must be less than 36 characters long' }] });
            }
            if (username.length < 4) {
                return res.status(400).json({ errors: [{ msg: 'Username must be atleast 4 characters long' }] });
            }
            user = new User({
                name,
                email,
                password,
                username: username.toLowerCase(),
                bio: "",
                accountType
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            let group = new Group({
                name: "All Followers",
                description: "Share with everyone who follows you",
                creator: user.id,
                members: new Array(user._id)
            });
            try {
                await group.save();
                let groups = [...user.groups, group._id];
                await user.updateOne({ groups });
            } catch (err) {
                console.log(err);
                res.status(500).send("Failed to make group")
            }
            const payload = {
                id: user.id + user.id, //Gets the ID of the user that was just saved. 
                iat: new Date().getTime()
            }
            await sendWelcomeMail(user.email, user.username);
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 3600 * 24 * 7 },
                (err, token) => {
                    if (err) throw err;
                    res.setHeader('Cache-Control', 'private');
                    res.cookie('userToken', token, { expires: new Date(Date.now() + (30*24*3600*1000)), httpOnly: true })
                    res.status(200).send("Cookie set for login");
                }
            )
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
        }
    });

//@route   /api/users/login
//@desc    Login a user
//access   Public

router.post('/login',
    async (req, res) => {
        const {email, password} = req.body;
        validateEmail = (email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        if(validateEmail(email)){
            try {
                const user = await User.findOne({ email });
                
                if (!user) {
                    return res.status(400).json({ errors: [{ msg: "Incorrect username or password. Please try again." }] });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ errors: [{ msg: "Incorrect username or password. Please try again." }] });
                }
                const payload = {
                    id: user.id + user.id, //Gets the ID of the user that was just saved. 
                    iat: new Date().getTime()
                }
                await user.updateOne({ lastActive: new Date() });
                newLogin(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
                sendNewLoginMail(user.email, user.username, (req.headers['x-forwarded-for'] || req.connection.remoteAddress))
                    .then(()=>console.log("Email Sent"))
                    .catch((err)=>console.log(err));
                jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    { expiresIn: "7 days" },
                    (err, token) => {
                        if (err) throw err;
                        res.setHeader('Cache-Control', 'private');
                        res.cookie('userToken', token, { expires: new Date(Date.now() + 30 * 24 * 3600 * 1000), httpOnly: true })
                        res.status(200).send("Cookie set for login");
                    }
                )
            } catch (err) {
                console.log(err.message);
                res.status(500).send("Server Error");
            }
        }else{
            try {
                const user = await User.findOne({ username : email.toLowerCase() });
                if (!user) {
                    return res.status(400).json({ errors: [{ msg: "Incorrect username or password. Please try again." }] });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ errors: [{ msg: "Incorrect username or password. Please try again." }] });
                }
                const payload = {
                    id: user.id + user.id, //Gets the ID of the user that was just saved. 
                    iat: new Date().getTime()
                }
                await user.updateOne({ lastActive: new Date() });
                newLogin(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
                sendNewLoginMail(user.email, user.username, (req.headers['x-forwarded-for'] || req.connection.remoteAddress))
                    .then(() => console.log("Email Sent"))
                    .catch((err) => console.log(err));
                jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    { expiresIn: "7 days" },
                    (err, token) => {
                        if (err) throw err;
                        res.setHeader('Cache-Control', 'private');
                        res.cookie('userToken', token, { expires: new Date(Date.now() + 30 * 24 * 3600 * 1000), httpOnly: true })
                        res.status(200).send("Cookie set for login");
                    }
                )
            } catch (err) {
                console.log(err.message);
                res.status(500).send("Server Error");
            }
        }
    });

//@route   /api/users/updateBio
//@desc    Update a users bio
//access   Private

router.post('/updateBio', auth, async (req, res) => {
    try {
        const { bio } = req.body;
        var length = bio.length;
        if (length > 300) {
            return res.status(400).send("Bio should be less that 300 characters in length");
        }
        const user = await User.findById(req.id);
        await user.updateOne({ bio });
        console.log("Updated bio")
        res.status(200).send("Bio of " + user.name + " has been updated!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/updateUsername
//@desc    Update a users Username
//access   Private

router.post('/updateUsername', auth, async (req, res) => {
    try {
        const { username } = req.body;
        if (username.length > 36) {
            return res.status(200).json({ valid: 0, message: "Length of username should be less than 36 characters" });
        }
        if (username.length < 4) {
            return res.status(200).json({ valid: 0, message: "Length of username should be more than 4 characters" });
        }
        if (!username.match(/^[a-zA-Z0-9_-]+$/)) {
            return res.status(200).json({ valid: 0, message: "Username can only contain a-z A-Z 0-9, underscore (_) and hyphen (-)" });
        }
        const testUser = await User.find({ username: username.toLowerCase() });
        if (testUser.length !== 0) {
            return res.status(200).json({ valid: 0, message: "The username has already been taken. Try another one!" });
        }
        const user = await User.findById(req.id);
        await user.updateOne({ username: username.toLowerCase() });
        res.status(200).json({ valid: 1, message: "Username succesfully updated" });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/updateName
//@desc    Update a users Name
//access   Private

router.post('/updateName', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.id);
        await user.updateOne({ name });
        res.status(200).send("Name of " + user.name + " has been updated!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/updateEmail
//@desc    Update a users Email
//access   Private

router.post('/updateEmail', auth, async (req, res) => {
    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    try {
        const { email } = req.body;
        if(!validateEmail(email)){
            res.status(400).send("That is not a valid Email ID")
        }
        let user = await User.findOne({email})
        if(user){
            res.status(403).send("Email already in use.")
        }else{

            user = await User.findById(req.id);
            await user.updateOne({ email });
            res.status(200).send("Name of " + user.name + " has been updated!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/authenticateUser
//@desc    Login or Register a user front end
//access   Private
router.post('/authenticateUser', auth, async (req, res) => {
    try {
        if (req.id) {
            const user = await User.findById(req.id);
            if (user === null) {
                res.status(400).send("User Auth failed");
            }
            const { id, name, username, profilePicture, bio, email, telegramUsername } = user;
            res.status(200).json({ id, name, username, profilePicture, bio, email, telegramUsername});
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/users/updateTelegramUsername
//@desc    Update Telegram Username
//access   Private
router.post('/updateTelegramUsername', auth, async (req, res) => {
    try {
        const user = await User.findById(req.id);
        if (user) {
            let {telegramUsername} = req.body;
            if(telegramUsername[0]==='@'){
                telegramUsername = telegramUsername.slice(1,telegramUsername.length)
            }
            await user.updateOne({telegramUsername});
            res.status(200).send("Updated!");
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});


//@route   /api/users/forgotPassword
//@desc    Login or Register a user front end
//access   Private
router.post('/forgotPassword', async (req, res) => {
    try {
        if (req.body.email) {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                console.log(user._id, user.email)
                let code = user._id.toString() + (new Date()).toString() + 'emailsecretkey';
                code = crypto.createHash('sha256').update(code).digest('hex');
                let link = "https://igloosocial.com/forgotpassword/" + code;
                const passwordReset = {
                    code,
                    sendDate : new Date()
                }
                await user.updateOne({passwordReset});
                console.log("Sending mail")
                await sendPasswordResetMail(user.email, user.username, link);
                res.status(200).send("Mail sent")

            } else {
                res.status(404).send("User not found");
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/users/verifyEmailForForgotPassword
//@desc    Verify is user can reset password
//access   Private
router.post('/verifyEmailForForgotPassword', async (req, res) => {
    try {
        const email = req.body.email;
        const code = req.body.code;
        const user = await User.findOne({ email })
        if(user){
            const passwordReset = user.passwordReset;
            const currentTime = new Date()
            const sendDate = new Date(passwordReset.sendDate)
            if (passwordReset.code === code && ((currentTime - sendDate) < 86400000)){
                res.status(200).send("Success")
            }else{
                res.status(400).send("The email reset link is invalid or has expired. Please try again.")
            }
        }else{
            res.status(404).send("User not found. Try again.")
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/users/resetPassword
//@desc    Verify is user can reset password
//access   Private
router.post('/resetPassword', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const user = await User.findOne({ email })
        if (user) {
            if(password===confirmPassword){
                const salt = await bcrypt.genSalt(10);
                const newPassword = await bcrypt.hash(password, salt);
                await user.update({password : newPassword, passwordReset : {}})
                res.status(200).send("Successfully reset password")
            }else{
                res.status(403).send("Passwords are not the same. Try again.")
            }
        } else {
            res.status(404).send("User not found. Try again.")
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/muteUser
//@desc    Verify is user can reset password
//access   Private
router.post('/muteUser',auth, async (req, res) => {
    try {
        const username = req.body.username;
        const userToMute = await User.findOne({ username })
        const user = await User.findById(req.id);
        if (user && userToMute) {
            let mutedUsers = user.mutedUsers;
            mutedUsers.unshift(userToMute._id.toString())
            await user.updateOne({mutedUsers})
            res.status(200).send("Success!");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/unmuteUser
//@desc    Verify is user can reset password
//access   Private
router.post('/unmuteUser', auth, async (req, res) => {
    try {
        const username = req.body.username;
        const userToMute = await User.findOne({ username })
        const user = await User.findById(req.id);
        if (user && userToMute) {
            let mutedUsers = user.mutedUsers;
            const index = mutedUsers.indexOf(userToMute._id.toString())
            mutedUsers.splice(index, 1)
            await user.updateOne({ mutedUsers })
            res.status(200).send("Success!");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/logOut
//@desc    Log a user out
//access   Private
router.post('/logOut', auth, async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'private');
        res.cookie('userToken', undefined, { httpOnly: true })
        res.status(200).send("Logged Out");
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/getEmailPreferences
//@desc    Get a users email prefernces
//access   Private
router.post('/getEmailPreferences', auth, async (req, res) => {
    try {
        const user = await User.findById(req.id);
        const { friendRequestEmails, newsletterEmails} = user.emailPreferences;
        res.status(200).json({friendRequestEmails, newsletterEmails});
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/updateEmailPreferences
//@desc    Get a users email prefernces
//access   Private
router.post('/updateEmailPreferences', auth, async (req, res) => {
    try {
        let user = await User.findById(req.id);
        const { friendRequestEmails, newsletterEmails } = req.body;
        const emailPreferences = {
            friendRequestEmails,
            newsletterEmails
        }
        await user.updateOne({emailPreferences});
        res.status(200).send("Saved!");
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/updatePassword
//@desc    Update the user's password
//access   Private
router.post('/updatePassword', auth, async (req, res) => {
    try {
        let user = await User.findById(req.id);
        const { newPassword, confirmNewPassword } = req.body;
        if (newPassword.length <= 6) {
            res.status(400).send("Password needs to be greater than 6 characters")
        }else{
            if (!(newPassword === confirmNewPassword)) {
                res.status(400).send("Passwords do not match")
            } else {
                const salt = await bcrypt.genSalt(10);
                const password = await bcrypt.hash(newPassword, salt);
                await user.updateOne({ password })
                res.status(200).send("Saved!");
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

//@route   /api/users/deleteUser
//@desc    Delete a user's profile
//access   Private

router.post('/deleteUser', auth, async (req, res) => {
    const user = await User.findById(req.id);
    if(user){
        user.friends.map(async(friendId)=>{
            let friend = await User.findById(friendId);
            if(friend){
                await User.updateOne({ _id: friendId }, { $pull: { friends: req.id } })
            }
        });
        user.posts.map(async(postId)=>{
            const post = await Post.findById(postId);
            if(!post.isText){
                const path = post.image;
                try {
                    fs.unlinkSync(path)
                    //file removed
                } catch (err) {
                    console.error(err)
                }
            }
            await Post.findOneAndDelete({ _id: postId });
        });
        await User.findOneAndDelete({ _id: req.id });
    }   
});

module.exports = router;