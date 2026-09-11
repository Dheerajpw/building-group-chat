require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

const { sequelize, connectDB } = require("./db");

// ==================== MODELS ====================

const ArchivedMessage = require("./models/archivedMessage");
const User = require("./models/user");
const Message = require("./models/message");
const archiveMessagesJob = require("./archiveMessages");

// ==================== ROUTES ====================

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const aiRoutes = require("./routes/aiRoutes");

// ==================== SOCKET.IO ====================

const setupSocket = require("./socket-io");

// ==================== APP ====================

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// ==================== DATABASE CONNECTION ====================

connectDB();

// ==================== AUTH ROUTES ====================

app.use("/api/auth", authRoutes);

// ==================== MESSAGE ROUTES ====================

app.use("/api/messages", messageRoutes);

// ==================== AI ROUTES ====================

app.use("/api/ai", aiRoutes);

// ==================== TEST API ====================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Group Chat Backend API is running",
    });
});

// ==================== DATABASE SYNC ====================

sequelize
    .sync()
    .then(() => {
        console.log(
            "Database tables synchronized successfully"
        );
    })
    .catch((error) => {
        console.error(
            "Database sync failed:",
            error.message
        );
    });

// ==================== HTTP SERVER ====================

const PORT =
    process.env.PORT || 5000;

const server =
    http.createServer(app);

// ==================== SOCKET.IO SETUP ====================

setupSocket(server);

// ==================== SERVER ====================

server.listen(
    PORT,
    () => {
        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            "Socket.IO server running"
        );
    }
);