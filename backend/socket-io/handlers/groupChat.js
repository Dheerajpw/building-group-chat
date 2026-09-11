const groupChatHandler = (io, socket) => {

    // ==================== JOIN GROUP ====================

    socket.on("join_group", (groupId) => {
        try {

            if (!groupId) {
                return;
            }

            const roomId = `group-${groupId}`;

            socket.join(roomId);

            console.log(
                `User ${socket.user.name} joined group: ${roomId}`
            );

            socket.emit("group_joined", {
                success: true,
                groupId: groupId,
                roomId: roomId,
                message: "Successfully joined group"
            });

        } catch (error) {

            console.error(
                "Join Group Error:",
                error
            );

        }
    });


    // ==================== LEAVE GROUP ====================

    socket.on("leave_group", (groupId) => {
        try {

            if (!groupId) {
                return;
            }

            const roomId = `group-${groupId}`;

            socket.leave(roomId);

            console.log(
                `User ${socket.user.name} left group: ${roomId}`
            );

        } catch (error) {

            console.error(
                "Leave Group Error:",
                error
            );

        }
    });


    // ==================== GROUP MESSAGE ====================

    socket.on("group_message", (data) => {
        try {

            if (
                !data ||
                !data.groupId ||
                !data.message
            ) {
                return;
            }

            const message = data.message.trim();

            if (!message) {
                return;
            }

            const roomId = `group-${data.groupId}`;

            const messageData = {
                userId: socket.user.id,
                user: socket.user.name,
                message: message,
                groupId: data.groupId,
                roomId: roomId,
                createdAt: new Date()
            };

            console.log(
                "Group message:",
                messageData
            );

            io.to(roomId).emit(
                "group_message",
                messageData
            );

        } catch (error) {

            console.error(
                "Group Message Error:",
                error
            );

        }
    });

};

module.exports = groupChatHandler;