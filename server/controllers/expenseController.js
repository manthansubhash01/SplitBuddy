const Expense = require("../models/Expense");
const Group = require("../models/Group");
const Notification = require("../models/Notification");
const { calculateBalances } = require("../utils/balanceCalculator");

// @desc    Add new expense
// @route   POST /api/groups/:groupId/expenses
// @access  Private
const addExpense = async (req, res) => {
    const { description, amount, payer, splitType, shares, receiptUri } =
        req.body;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    // Verify membership
    const isMember = group.members.some(
        (member) => member.user.toString() === req.user.id
    );
    if (!isMember) {
        return res.status(403).json({ message: "Not authorized" });
    }

    const expense = await Expense.create({
        group: groupId,
        description,
        amount,
        payer,
        splitType,
        shares,
        receiptUri,
        addedBy: req.user.id,
    });

    // Add expense to group
    group.expenses.push(expense._id);
    await group.save();

    // Notify members (except adder)
    // Logic to notify involved members...

    // Emit socket event
    const io = req.app.get("io");
    io.to(groupId).emit("expense_added", expense);

    res.status(201).json(expense);
};

// @desc    Get group expenses
// @route   GET /api/groups/:groupId/expenses
// @access  Private
const getExpenses = async (req, res) => {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId })
        .populate("payer", "name")
        .populate("addedBy", "name")
        .sort({ createdAt: -1 });

    res.json(expenses);
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
    }

    // Check authorization (only adder or payer can edit? or anyone in group?)
    // For now, allow adder
    if (expense.addedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to edit this expense" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedExpense);
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.addedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    // Remove from group
    await Group.findByIdAndUpdate(expense.group, {
        $pull: { expenses: expense._id },
    });

    await expense.deleteOne();

    res.json({ message: "Expense removed" });
};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
};
