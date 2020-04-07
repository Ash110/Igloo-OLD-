const express = require('express');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Group = require('../../models/Group');


const router = express.Router();

//@route   /api/groups/newGroup
//@desc    Create a new group
//access   Private
router.post('/newGroup', auth, async (req, res) => {
    const {groupName, groupDescription } = req.body;
    try {
        const user = await User.findById(req.id);
        let group = new Group({
            name:groupName,
            description:groupDescription,
            creator : req.id,
            members : new Array(req.id)
        });
        await group.save();
        let groups = [...user.groups, group._id];
        await user.updateOne({groups});
        res.status(200).send("Group successfully created!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/groups/getGroups
//@desc    Get all user groups
//access   Private
router.post('/getGroups', auth, async (req, res) => {
    try {
        const user = await User.findById(req.id).populate('groups', 'name description');
        res.status(200).send(user.groups);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/groups/getGroupInfo
//@desc    Sends 2 arrays, friends in group, friends not in group
//access   Private
router.post('/getGroupInfo', auth, async (req, res) => {
    const {groupId} = req.body
    try {
        let userFriends = await User.findById(req.id).populate('friends','name _id username');
        const group = await Group.findById(groupId).populate('members', 'name _id username');
        userFriends = userFriends.friends
        groupMembers = group.members.splice(1, group.members.length);
        let notInGroup = (userFriends.filter(x => !groupMembers.some(e => e._id.toString() === x._id.toString())));
        res.status(200).json({groupMembers, notInGroup, groupName : group.name, groupDescription : group.description });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/groups/updateGroup
//@desc    Update the group with members
//access   Private
router.post('/updateGroup', auth, async (req, res) => {
    let updatedGroupMembers = []
    updatedGroupMembers.push(req.id);
    const { groupMembers,groupId, name, description } = req.body;
    try {
        let group = await Group.findById(groupId);
        groupMembers.map((member) => {
            updatedGroupMembers.push(member._id)
        });
        await group.updateOne({members : updatedGroupMembers, name, description});
        res.status(200).send("Success!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//@route   /api/groups/deleteGroup
//@desc    Update the group with members
//access   Private
router.post('/deleteGroup', auth, async (req, res) => {
    const { groupId} = req.body;
    try {
        await Group.findByIdAndDelete(groupId);
        res.status(200).send("Success!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;