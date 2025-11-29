const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        type: {
            type: String,
            enum: [
                "invite",
                "expenseAdded",
                "paymentRequested",
                "paymentMarked",
                "paymentApproved",
                "settled",
            ],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId, // Could be Group, Expense, or Settlement ID
        },
        relatedModel: {
            type: String,
            enum: ["Group", "Expense", "Settlement"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
