const mongoose = require("mongoose");

const SettlementSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["requested", "markedPaid", "approved", "disputed"],
            default: "requested",
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        markedAt: {
            type: Date,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        approvedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Settlement", SettlementSchema);
