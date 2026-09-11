const Message = require("../../models/message");

// =====================================================
// CHAT SOCKET HANDLER
// =====================================================

const chatHandler = (io, socket) => {

    // ==================== SEND MESSAGE ====================

    socket.on("sendMessage", async (data) => {

        try {

            console.log(
                "Message received from:",
                socket.user.name
            );

            // ==================== VALIDATION ====================

            if (
                !data.message ||
                !data.message.trim()
            ) {
                return;
            }

            // ==================== GET AUTHENTICATED USER ====================

            const userId = socket.user.id;
            const userName = socket.user.name;

            // ==================== SAVE MESSAGE ====================

            const newMessage = await Message.create({

                userId: userId,

                message: data.message.trim(),

            });

            console.log(
                "Message saved to database:",
                newMessage.id
            );

            // ==================== SEND TO ALL USERS ====================

            io.to("building-group").emit(
                "receiveMessage",
                {

                    id: newMessage.id,

                    userId: userId,

                    message: newMessage.message,

                    user: userName,

                    createdAt: newMessage.createdAt,

                }
            );

        } catch (error) {

            console.error(
                "Socket Message Error:",
                error
            );

        }

    });

};

module.exports = chatHandler;