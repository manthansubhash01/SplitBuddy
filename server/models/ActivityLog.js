const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        details: {
            type: Object, // Flexible field for storing details like expense title, amount, etc.
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
