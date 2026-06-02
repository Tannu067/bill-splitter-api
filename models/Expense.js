const mongoose = require('mongoose');

// each expense tracks who paid, how much, and who it's split among
const expenseSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  splitAmong: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  settled: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
