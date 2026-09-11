// =====================================================
// PERSONAL CHAT HANDLER
// =====================================================

const personalChatHandler = (io, socket) => {

    // =================================================
    // JOIN PERSONAL CHAT ROOM
    // =================================================

    socket.on(
        "join_room",
        (roomId) => {

            try {

                if (!roomId) {

                    return;

                }


                socket.join(roomId);


                console.log(
                    `User ${socket.user.name} joined room: ${roomId}`
                );

            } catch (error) {

                console.error(
                    "Join Room Error:",
                    error
                );

            }

        }
    );


    // =================================================
    // LEAVE PERSONAL CHAT ROOM
    // =================================================

    socket.on(
        "leave_room",
        (roomId) => {

            try {

                if (!roomId) {

                    return;

                }


                socket.leave(roomId);


                console.log(
                    `User ${socket.user.name} left room: ${roomId}`
                );

            } catch (error) {

                console.error(
                    "Leave Room Error:",
                    error
                );

            }

        }
    );


    // =================================================
    // SEND PERSONAL MESSAGE
    // =================================================

    socket.on(
        "new_message",
        (data) => {

            try {

                if (
                    !data ||
                    !data.roomId ||
                    !data.message
                ) {

                    return;

                }


                const message =
                    data.message.trim();


                if (!message) {

                    return;

                }


                const messageData = {

                    userId:
                        socket.user.id,

                    user:
                        socket.user.name,

                    message:
                        message,

                    roomId:
                        data.roomId,

                    createdAt:
                        new Date(),

                };


                console.log(
                    "Personal message:",
                    messageData
                );


                // =================================================
                // SEND ONLY TO SPECIFIC ROOM
                // =================================================

                io.to(data.roomId).emit(
                    "new_message",
                    messageData
                );


            } catch (error) {

                console.error(
                    "Personal Message Error:",
                    error
                );

            }

        }
    );

};


module.exports =
    personalChatHandler;