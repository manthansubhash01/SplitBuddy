const Settlement = require("../models/Settlement");
const Group = require("../models/Group");
const Expense = require("../models/Expense");
const Notification = require("../models/Notification");
const {
    calculateBalances,
    calculateSettlements,
} = require("../utils/balanceCalculator");

// @desc    Get group balances and suggested settlements
// @route   GET /api/groups/:groupId/balances
// @access  Private
const getBalances = async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate("members.user", "name");

    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    const expenses = await Expense.find({ group: groupId });

    const balances = calculateBalances(expenses, group.members);
    const settlements = calculateSettlements(balances);

    res.json({ balances, settlements });
};

// @desc    Request a settlement (create a payment record)
// @route   POST /api/groups/:groupId/settlements
// @access  Private
const createSettlement = async (req, res) => {
    const { toUserId, amount } = req.body;
    const { groupId } = req.params;

    const settlement = await Settlement.create({
        group: groupId,
        fromUser: req.user.id,
        toUser: toUserId,
        amount,
        status: "requested",
    });

    // Notify payee
    await Notification.create({
        toUser: toUserId,
        fromUser: req.user.id,
        type: "paymentRequested",
        message: `${req.user.name} initiated a settlement of ₹${amount}`,
        relatedId: settlement._id,
        relatedModel: "Settlement",
    });

    res.status(201).json(settlement);
};

// @desc    Mark settlement as paid
// @route   POST /api/settlements/:id/pay
// @access  Private
const markAsPaid = async (req, res) => {
    const settlement = await Settlement.findById(req.params.id);

    if (!settlement) {
        return res.status(404).json({ message: "Settlement not found" });
    }

    if (settlement.fromUser.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
    }

    settlement.status = "markedPaid";
    settlement.markedBy = req.user.id;
    settlement.markedAt = Date.now();
    await settlement.save();

    // Notify payee
    await Notification.create({
        toUser: settlement.toUser,
        fromUser: req.user.id,
        type: "paymentMarked",
        message: `${req.user.name} marked a payment of ₹${settlement.amount} as paid`,
        relatedId: settlement._id,
        relatedModel: "Settlement",
    });

    res.json(settlement);
};

// @desc    Approve settlement (Confirm receipt)
// @route   POST /api/settlements/:id/approve
// @access  Private
const approveSettlement = async (req, res) => {
    const settlement = await Settlement.findById(req.params.id);

    if (!settlement) {
        return res.status(404).json({ message: "Settlement not found" });
    }

    if (settlement.toUser.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
    }

    settlement.status = "approved";
    settlement.approvedBy = req.user.id;
    settlement.approvedAt = Date.now();
    await settlement.save();

    // Create a payment expense to reflect in balances
    await Expense.create({
        group: settlement.group,
        description: "Settlement Payment",
        amount: settlement.amount,
        payer: settlement.fromUser,
        splitType: "unequal",
        shares: [{ user: settlement.toUser, amount: settlement.amount }],
        addedBy: req.user.id,
        isPayment: true,
    });

    // Notify payer
    await Notification.create({
        toUser: settlement.fromUser,
        fromUser: req.user.id,
        type: "paymentApproved",
        message: `${req.user.name} confirmed your payment of ₹${settlement.amount}`,
        relatedId: settlement._id,
        relatedModel: "Settlement",
    });

    // Emit socket event
    const io = req.app.get("io");
    io.to(settlement.group.toString()).emit("settlement_approved", settlement);

    res.json(settlement);
};

module.exports = {
    getBalances,
    createSettlement,
    markAsPaid,
    approveSettlement,
};
