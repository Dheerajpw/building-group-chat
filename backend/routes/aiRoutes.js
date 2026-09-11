const express = require("express");

const {
    predictiveTyping,
    smartReplies
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/predictive",
    authMiddleware,
    predictiveTyping
);

router.post(
    "/replies",
    authMiddleware,
    smartReplies
);

module.exports = router;