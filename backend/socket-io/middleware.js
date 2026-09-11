const jwt = require("jsonwebtoken");
const User = require("../models/user");

// =====================================================
// SOCKET.IO AUTHENTICATION MIDDLEWARE
// =====================================================

const socketAuthMiddleware = async (socket, next) => {
    try {

        // ==================== GET TOKEN ====================

        const token = socket.handshake.auth.token;

        // Token missing
        if (!token) {
            return next(
                new Error("Authentication token is missing")
            );
        }

        // ==================== VERIFY JWT ====================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET ||
            "group_chat_secret_key"
        );

        console.log(
            "Decoded socket user:",
            decoded
        );

        // ==================== FIND USER ====================

        const user = await User.findByPk(decoded.id);

        // User not found
        if (!user) {
            return next(
                new Error("User not found")
            );
        }

        // ==================== ATTACH USER TO SOCKET ====================

        socket.user = user;

        console.log(
            "Socket authenticated for user:",
            user.name,
            "ID:",
            user.id
        );

        // Authentication successful
        next();

    } catch (error) {

        console.error(
            "Socket authentication failed:",
            error.message
        );

        next(
            new Error("Invalid or expired token")
        );
    }
};

module.exports = socketAuthMiddleware;