const express = require("express");

const {
    sendMessage,
    getMessages,
    uploadMedia,
} = require("../controllers/messageController");

const authenticateToken =
    require("../middleware/authMiddleware");

const multer = require("multer");

const router = express.Router();


// ==================== MULTER CONFIG ====================

const upload = multer({
    storage: multer.memoryStorage(),
});


// ==================== SEND TEXT MESSAGE ====================

router.post(
    "/",
    authenticateToken,
    sendMessage
);


// ==================== GET MESSAGES ====================

router.get(
    "/",
    authenticateToken,
    getMessages
);


// ==================== UPLOAD MEDIA ====================

router.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    uploadMedia
);


module.exports = router;