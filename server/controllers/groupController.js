const Group = require("../models/Group");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res) => {
    const { name, description, members } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Group name is required" });
    }

    const initialMembers = [{ user: req.user.id, status: "joined" }];

    if (members && Array.isArray(members)) {
        members.forEach(member => {
            // Avoid adding creator twice if they are in the list
            if (member.id !== req.user.id) {
                initialMembers.push({ user: member.id, status: "invited" });
            }
        });
    }

    const group = await Group.create({
        name,
        description,
        creator: req.user.id,
        members: initialMembers,
    });

    // Add group to user's groups list (creator)
    await User.findByIdAndUpdate(req.user.id, { $push: { groups: group._id } });

    // Optionally add group to invited members' lists (or wait for them to join)
    // For now, we'll add it so it shows up in their list immediately as 'invited'
    if (members && Array.isArray(members)) {
        for (const member of members) {
            if (member.id !== req.user.id) {
                await User.findByIdAndUpdate(member.id, { $addToSet: { groups: group._id } });
            }
        }
    }

    // Emit socket event to invited members
    const io = req.app.get("io");
    if (members && Array.isArray(members)) {
        members.forEach(member => {
            if (member.id !== req.user.id) {
                io.to(member.id).emit("added_to_group", group);
            }
        });
    }

    res.status(201).json(group);
};

// @desc    Get user's groups
// @route   GET /api/groups
// @access  Private
const getGroups = async (req, res) => {
    const groups = await Group.find({ "members.user": req.user.id })
        .populate("members.user", "name email profilePic")
        .populate({
            path: "expenses",
            populate: { path: "payer", select: "name" },
        })
        .sort({ createdAt: -1 });

    res.json(groups);
};

// @desc    Get group details
// @route   GET /api/groups/:id
// @access  Private
const getGroup = async (req, res) => {
    const group = await Group.findById(req.params.id)
        .populate("members.user", "name email profilePic")
        .populate({
            path: "expenses",
            populate: { path: "payer", select: "name" },
        });

    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    const isMember = group.members.some(
        (member) => member.user._id.toString() === req.user.id
    );

    if (!isMember) {
        return res.status(403).json({ message: "Not authorized to view this group" });
    }

    res.json(group);
};

// @desc    Invite member to group
// @route   POST /api/groups/:id/invite
// @access  Private
const inviteMember = async (req, res) => {
    const { email } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    const userToInvite = await User.findOne({ email });

    if (!userToInvite) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if already a member
    const isMember = group.members.some(
        (member) => member.user.toString() === userToInvite.id
    );

    if (isMember) {
        return res.status(400).json({ message: "User is already a member" });
    }

    // Add to group members with 'invited' status
    group.members.push({ user: userToInvite.id, status: "invited" });
    await group.save();

    // Create notification
    await Notification.create({
        toUser: userToInvite.id,
        fromUser: req.user.id,
        type: "invite",
        message: `${req.user.name} invited you to join '${group.name}'`,
        relatedId: group._id,
        relatedModel: "Group",
    });

    // Emit socket event if user is online
    const io = req.app.get("io");
    // In a real app, we'd map userId to socketId. For now, we broadcast or rely on client polling/room logic
    // io.to(userToInvite.id).emit("notification", { ... });

    res.json({ message: "Invitation sent" });
};

// @desc    Join group (Accept Invite)
// @route   POST /api/groups/:id/join
// @access  Private
const joinGroup = async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    // Find member entry
    const memberIndex = group.members.findIndex(
        (member) => member.user.toString() === req.user.id
    );

    if (memberIndex === -1) {
        // Allow joining public groups or via link if implemented, but for now strict invite
        return res.status(400).json({ message: "You have not been invited" });
    }

    group.members[memberIndex].status = "joined";
    await group.save();

    // Add group to user's list
    await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { groups: group._id },
    });

    res.json({ message: "Joined group successfully" });
};

// @desc    Settle group (Archive)
// @route   POST /api/groups/:id/settle
// @access  Private
const settleGroup = async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    // Check authorization (only creator or any member?)
    // Allow any member for now
    const isMember = group.members.some(
        (member) => member.user.toString() === req.user.id
    );

    if (!isMember) {
        return res.status(403).json({ message: "Not authorized" });
    }

    group.isSettled = true;
    group.settledAt = new Date();
    await group.save();

    // Create notification/activity
    // ...

    // Emit socket event
    const io = req.app.get("io");
    io.to(req.params.id).emit("group_settled", group);

    res.json({ message: "Group settled and archived", group });
};

module.exports = {
    createGroup,
    getGroups,
    getGroup,
    inviteMember,
    joinGroup,
    settleGroup,
};
