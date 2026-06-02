const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { createGroup, getMyGroups, addMember } = require('../controllers/groupController');

router.post('/', protect, createGroup);
router.get('/my', protect, getMyGroups);
router.put('/:id/add-member', protect, addMember);

module.exports = router;
