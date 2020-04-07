const express = require('express');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const path = require('path');
const fs = require('fs');


const router = express.Router();

var saveTo;

//@route   /api/profilePicture/uploadProfilePicture
//@desc    Upload a new profile picture
//access   Private
router.post('/uploadProfilePicture', auth, async (req, res) => {
    //Initialise Busboy
    let imageFile = req.body.profilePicture.replace(/^data:image\/jpeg;base64,/, "");
    //Save the file to path. It uses the route as the path for some reason so need to go up two dir to reach src
    saveTo = path.join(__dirname, '../../images/ProfilePictures/' + req.id+".jpeg");
    fs.writeFile(saveTo, imageFile, 'base64', async (error) => {
        if (error) console.error(error);
        else {
            const user = await User.findById(req.id);
            try {
                await user.updateOne({ profilePicture: saveTo });
                res.status(200).send("Successfully Updated!");
            } catch (err) {
                console.log(err);
                res.status(500).send("Server Error!");
            }
        } 
    });
    // var busboy = new Busboy({ headers: req.headers });

    // busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    //     //Getting the file extension
    //     var fileExtenstion = (filename.split('.'));
    //     fileExtenstion = fileExtenstion[fileExtenstion.length - 1]
    //     console.log(fileExtenstion);
    //     //Save the file to path. It uses the route as the path for some reason so need to go up two dir to reach src
    //     saveTo = path.join(__dirname, '../../images/profilePictures/' + req.id + "." + fileExtenstion);
    //     file.pipe(fs.createWriteStream(saveTo));
    // });

    // busboy.on('finish', async () => {
    //     const user = await User.findById(req.id);
    //     try {
    //         await user.updateOne({ profilePicture: saveTo });
    //     } catch (err) {
    //         console.log(err);
    // //     }

    //     res.status(200).send("Profile Picture has been succesfully uploaded");
    // });
    // return req.pipe(busboy);
});

//@route   /api/profilePicture/getProfilePicture
//@desc    Get a profile Picture
//access   Private
router.post('/getProfilePicture', async (req, res) => {
    const saveTo = path.join(__dirname, '../../images/ProfilePictures/');
    const user = await User.findById(req.body.profileId);
    if (user.profilePicture != "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png"){
        try {
            var fileExtenstion = (user.profilePicture.split('.'));
            fileExtenstion = fileExtenstion[fileExtenstion.length - 1];
            const fileName = req.body.profileId + "." + fileExtenstion;
            res.status(200).sendFile(fileName, { root: saveTo });
        } catch (err) {
            console.log("Error be happening");
            console.log(err);
            res.status(500).send("Server Error");
        }
    }else{
        try {
            const fileName = "default.png";
            res.status(200).sendFile(fileName, { root: saveTo });
        } catch (err) {
            console.log("Error be happening");
            console.log(err);
            res.status(500).send("Server Error");
        }
    }
})

module.exports = router;