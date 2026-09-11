const { Server } = require("socket.io");

const socketAuthMiddleware = require("./middleware");
const chatHandler = require("./handlers/chat");
const personalChatHandler = require("./handlers/personalChat");
const groupChatHandler = require("./handlers/groupChat");

// =====================================================
// SOCKET.IO SETUP
// =====================================================

const setupSocket = (server) => {

    const io = new Server(server, {

        cors: {
            origin: "*",
        },

    });

    // =================================================
    // SOCKET AUTHENTICATION
    // =================================================

    io.use(socketAuthMiddleware);

    // =================================================
    // SOCKET CONNECTION
    // =================================================

    io.on("connection", (socket) => {

        console.log(
            "Authenticated user connected:",
            socket.user.name
        );

        console.log(
            "User ID:",
            socket.user.id
        );

        console.log(
            "Socket ID:",
            socket.id
        );


        // =================================================
        // DEFAULT GROUP CHAT
        // =================================================

        socket.join("building-group");


        // =================================================
        // GENERAL CHAT HANDLER
        // =================================================

        chatHandler(io, socket);


        // =================================================
        // PERSONAL CHAT HANDLER
        // =================================================

        personalChatHandler(io, socket);


        // =================================================
        // CUSTOM GROUP CHAT HANDLER
        // =================================================

        groupChatHandler(io, socket);


        // =================================================
        // DISCONNECT
        // =================================================

        socket.on("disconnect", () => {

            console.log(
                "Authenticated user disconnected:",
                socket.user.name
            );

            console.log(
                "Socket ID:",
                socket.id
            );

        });

    });


    return io;
};

module.exports = setupSocket;