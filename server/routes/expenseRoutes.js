const express = require("express");
const router = express.Router({ mergeParams: true }); // Merge params to access groupId
const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, addExpense).get(protect, getExpenses);
router.route("/:id").put(protect, updateExpense).delete(protect, deleteExpense);

module.exports = router;
