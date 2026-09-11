
const express = require("express");

const {
    signup,
    login,
    checkUserByEmail
} = require("../controllers/authController");

const router = express.Router();


// ==================== SIGNUP ====================

router.post("/signup", signup);


// ==================== LOGIN ====================

router.post("/login", login);


// ==================== CHECK USER ====================

router.post("/check-user", checkUserByEmail);


module.exports = router;
