const Expense = require('../models/Expense');
const Group = require('../models/Group');

// add a new expense to a group
const addExpense = async (req, res) => {
  const { groupId, description, amount, splitAmong } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const expense = await Expense.create({
      group: groupId,
      description,
      amount,
      paidBy: req.user.id,
      splitAmong,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all expenses in a group
const getGroupExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name')
      .populate('splitAmong', 'name');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// the main logic — calculate who owes whom in a group
// this simplifies all debts into net balances so you get fewest transactions
const getBalances = async (req, res) => {
  try {
    const expenses = await Expense.find({
      group: req.params.groupId,
      settled: false,
    });

    // build a balance map — positive means someone is owed, negative means they owe
    const balances = {};

    for (const expense of expenses) {
      const share = expense.amount / expense.splitAmong.length;
      const payer = expense.paidBy.toString();

      // person who paid gets credited
      balances[payer] = (balances[payer] || 0) + expense.amount;

      // each person in the split gets debited their share
      for (const memberId of expense.splitAmong) {
        const member = memberId.toString();
        balances[member] = (balances[member] || 0) - share;
      }
    }

    // convert balance map into readable "X owes Y amount" format
    const settlements = [];
    const people = Object.keys(balances);

    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        const a = people[i];
        const b = people[j];

        if (balances[a] < 0 && balances[b] > 0) {
          const amount = Math.min(Math.abs(balances[a]), balances[b]);
          settlements.push({ from: a, to: b, amount: amount.toFixed(2) });
        } else if (balances[b] < 0 && balances[a] > 0) {
          const amount = Math.min(Math.abs(balances[b]), balances[a]);
          settlements.push({ from: b, to: a, amount: amount.toFixed(2) });
        }
      }
    }

    res.json({ balances, settlements });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// mark all expenses in a group as settled
const settleExpenses = async (req, res) => {
  try {
    await Expense.updateMany(
      { group: req.params.groupId },
      { settled: true }
    );
    res.json({ message: 'All expenses settled for this group' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addExpense, getGroupExpenses, getBalances, settleExpenses };
