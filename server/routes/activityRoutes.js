const express = require("express");
const router = express.Router({ mergeParams: true });
const { getActivityLog } = require("../controllers/activityController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getActivityLog);

module.exports = router;
