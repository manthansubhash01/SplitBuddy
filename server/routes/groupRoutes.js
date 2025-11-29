const express = require("express");
const router = express.Router();
const {
    createGroup,
    getGroups,
    getGroup,
    inviteMember,
    joinGroup,
    settleGroup,
} = require("../controllers/groupController");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, createGroup).get(protect, getGroups);
router.route("/:id").get(protect, getGroup);
router.post("/:id/invite", protect, inviteMember);
router.post("/:id/join", protect, joinGroup);
router.post("/:id/settle", protect, settleGroup);

module.exports = router;
