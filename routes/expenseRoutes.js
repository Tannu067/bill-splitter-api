const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  addExpense,
  getGroupExpenses,
  getBalances,
  settleExpenses,
} = require('../controllers/expenseController');

router.post('/', protect, addExpense);
router.get('/group/:groupId', protect, getGroupExpenses);
router.get('/balances/:groupId', protect, getBalances);
router.put('/settle/:groupId', protect, settleExpenses);

module.exports = router;
