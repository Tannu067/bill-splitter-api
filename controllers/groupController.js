const Group = require('../models/Group');
const User = require('../models/User');

// create a new group and add the creator as first member
const createGroup = async (req, res) => {
  const { name, memberEmails } = req.body;
  try {
    // find all users by their emails
    const members = await User.find({ email: { $in: memberEmails } });
    const memberIds = members.map(m => m._id);

    // make sure creator is always in the group
    if (!memberIds.includes(req.user.id)) {
      memberIds.push(req.user.id);
    }

    const group = await Group.create({
      name,
      createdBy: req.user.id,
      members: memberIds,
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all groups the logged in user is part of
const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate('members', 'name email')
      .populate('createdBy', 'name');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// add a new member to an existing group
const addMember = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // don't add if already a member
    if (group.members.includes(user._id)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    group.members.push(user._id);
    await group.save();
    res.json({ message: 'Member added', group });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createGroup, getMyGroups, addMember };
