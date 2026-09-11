// =====================================================
// AUTH TOKEN
// =====================================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login/login.html";
}


// =====================================================
// ELEMENTS
// =====================================================

const messageInput =
    document.getElementById("messageInput");

const chatMessages =
    document.getElementById("chatMessages");

const sendButton =
    document.getElementById("sendButton");

const userEmailInput =
    document.getElementById("userEmailInput");

const joinChatButton =
    document.getElementById("joinChatButton");

const currentRoomInfo =
    document.getElementById("currentRoomInfo");


// =====================================================
// GROUP CHAT ELEMENTS
// =====================================================

const groupIdInput =
    document.getElementById("groupIdInput");

const joinGroupButton =
    document.getElementById("joinGroupButton");

const createGroupButton =
    document.getElementById("createGroupButton");


// =====================================================
// MEDIA ELEMENTS
// =====================================================

const mediaButton =
    document.getElementById("mediaButton");

const mediaInput =
    document.getElementById("mediaInput");


// =====================================================
// SOCKET.IO
// =====================================================

const socket =
    io("http://localhost:5000", {
        auth: {
            token: token
        }
    });


// =====================================================
// CURRENT ROOM
// =====================================================

let currentRoom = null;


// =====================================================
// SOCKET CONNECT
// =====================================================

socket.on("connect", function () {

    console.log(
        "Socket connected:",
        socket.id
    );

});


// =====================================================
// SOCKET ERROR
// =====================================================

socket.on("connect_error", function (error) {

    console.error(
        "Socket connection error:",
        error
    );

});


// =====================================================
// RECEIVE TEXT MESSAGE
// =====================================================

socket.on("receive_message", function (data) {

    console.log(
        "Received message:",
        data
    );

    createMessage(data);

});


// =====================================================
// RECEIVE GROUP MESSAGE
// =====================================================

socket.on("receive_group_message", function (data) {

    console.log(
        "Received group message:",
        data
    );

    createMessage(data);

});


// =====================================================
// JOIN PERSONAL CHAT
// =====================================================

if (joinChatButton) {

    joinChatButton.addEventListener(
        "click",
        function () {

            const email =
                userEmailInput.value.trim();

            if (!email) {

                alert(
                    "Please enter user email."
                );

                return;
            }

            currentRoom =
                `private_${email}`;

            if (currentRoomInfo) {

                currentRoomInfo.textContent =
                    `Chatting with ${email}`;

            }

            socket.emit(
                "join_room",
                currentRoom
            );

            console.log(
                "Joined room:",
                currentRoom
            );

        }
    );
}


// =====================================================
// JOIN GROUP
// =====================================================

if (joinGroupButton) {

    joinGroupButton.addEventListener(
        "click",
        function () {

            const groupId =
                groupIdInput.value.trim();

            if (!groupId) {

                alert(
                    "Please enter group ID."
                );

                return;
            }

            currentRoom =
                `group_${groupId}`;

            if (currentRoomInfo) {

                currentRoomInfo.textContent =
                    `Group: ${groupId}`;

            }

            socket.emit(
                "join_group",
                groupId
            );

            console.log(
                "Joined group:",
                groupId
            );

            loadMessages();

        }
    );
}


// =====================================================
// CREATE GROUP
// =====================================================

if (createGroupButton) {

    createGroupButton.addEventListener(
        "click",
        function () {

            const groupId =
                groupIdInput.value.trim();

            if (!groupId) {

                alert(
                    "Enter group ID."
                );

                return;
            }

            socket.emit(
                "create_group",
                {
                    groupId: groupId
                }
            );

        }
    );
}


// =====================================================
// SEND TEXT MESSAGE
// =====================================================

if (sendButton) {

    sendButton.addEventListener(
        "click",
        sendMessage
    );
}


if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();

            }

        }
    );
}


// =====================================================
// SEND MESSAGE FUNCTION
// =====================================================

async function sendMessage() {

    const message =
        messageInput.value.trim();

    if (!message) {
        return;
    }

    if (!token) {

        alert(
            "Please login first."
        );

        return;
    }

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/messages",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );

        const data =
            await response.json();

        console.log(
            "Send message response:",
            data
        );

        if (!response.ok) {

            alert(
                data.message ||
                "Message sending failed."
            );

            return;
        }

        messageInput.value = "";

        createMessage(
            data.data
        );

    } catch (error) {

        console.error(
            "Send message error:",
            error
        );

        alert(
            "Unable to send message."
        );

    }

}


// =====================================================
// MEDIA BUTTON
// =====================================================

if (mediaButton && mediaInput) {

    mediaButton.addEventListener(
        "click",
        function () {

            console.log(
                "Media button clicked"
            );

            mediaInput.click();

        }
    );

}


// =====================================================
// MEDIA FILE SELECTED
// =====================================================

if (mediaInput) {

    mediaInput.addEventListener(
        "change",
        function () {

            const file =
                mediaInput.files[0];

            if (!file) {
                return;
            }

            console.log(
                "Selected file:",
                file.name
            );

            console.log(
                "File type:",
                file.type
            );

            console.log(
                "File size:",
                file.size
            );

            uploadMedia();

        }
    );

}


// =====================================================
// UPLOAD MEDIA
// =====================================================

async function uploadMedia() {

    const file =
        mediaInput.files[0];

    if (!file) {
        return;
    }


    // ================================================
    // MAX FILE SIZE = 10 MB
    // ================================================

    const maxSize =
        10 * 1024 * 1024;

    if (file.size > maxSize) {

        alert(
            "File size must be less than 10 MB."
        );

        mediaInput.value = "";

        return;
    }


    // ================================================
    // CHECK TOKEN
    // ================================================

    if (!token) {

        alert(
            "Please login first."
        );

        return;
    }


    try {

        const formData =
            new FormData();


        // IMPORTANT
        // Backend expects field name "file"

        formData.append(
            "file",
            file
        );


        console.log(
            "Uploading media..."
        );


        const response =
            await fetch(
                "http://localhost:5000/api/messages/upload",
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: formData

                }
            );


        const data =
            await response.json();


        console.log(
            "Media upload response:",
            data
        );


        if (!response.ok ||
            !data.success) {

            alert(
                data.message ||
                "Media upload failed."
            );

            return;
        }


        console.log(
            "Media uploaded successfully"
        );


        // ============================================
        // SHOW MEDIA IN CHAT
        // ============================================

        createMessage(
            data.data
        );


        // ============================================
        // CLEAR FILE INPUT
        // ============================================

        mediaInput.value = "";


    } catch (error) {

        console.error(
            "Media upload error:",
            error
        );

        alert(
            "Unable to upload media."
        );

        mediaInput.value = "";

    }

}


// =====================================================
// CREATE MESSAGE UI
// =====================================================

function createMessage(data) {

    if (!chatMessages) {
        return;
    }


    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "chat-message";


    // =================================================
    // USER ID
    // =================================================

    const userDiv =
        document.createElement("div");

    userDiv.className =
        "message-user";

    userDiv.textContent =
        `User ${data.userId || ""}`;


    messageDiv.appendChild(
        userDiv
    );


    // =================================================
    // MEDIA MESSAGE
    // =================================================

    if (data.mediaUrl) {

        const mediaContainer =
            document.createElement("div");

        mediaContainer.className =
            "media-message";


        const mediaType =
            data.mediaType || "";


        // =============================================
        // IMAGE
        // =============================================

        if (
            mediaType.startsWith("image/")
        ) {

            const image =
                document.createElement("img");

            image.src =
                data.mediaUrl;

            image.alt =
                "Shared image";

            image.className =
                "chat-image";

            image.style.maxWidth =
                "300px";

            image.style.maxHeight =
                "300px";

            image.style.borderRadius =
                "10px";

            image.style.cursor =
                "pointer";


            image.addEventListener(
                "click",
                function () {

                    window.open(
                        data.mediaUrl,
                        "_blank"
                    );

                }
            );


            mediaContainer.appendChild(
                image
            );

        }


        // =============================================
        // VIDEO
        // =============================================

        else if (
            mediaType.startsWith("video/")
        ) {

            const video =
                document.createElement("video");

            video.src =
                data.mediaUrl;

            video.controls =
                true;

            video.className =
                "chat-video";

            video.style.maxWidth =
                "350px";

            video.style.maxHeight =
                "300px";

            video.style.borderRadius =
                "10px";


            mediaContainer.appendChild(
                video
            );

        }


        // =============================================
        // OTHER FILE
        // =============================================

        else {

            const fileLink =
                document.createElement("a");

            fileLink.href =
                data.mediaUrl;

            fileLink.target =
                "_blank";

            fileLink.rel =
                "noopener noreferrer";

            fileLink.textContent =
                "📎 Open shared file";


            fileLink.className =
                "file-link";


            mediaContainer.appendChild(
                fileLink
            );

        }


        messageDiv.appendChild(
            mediaContainer
        );

    }


    // =================================================
    // TEXT MESSAGE
    // =================================================

    if (
        data.message &&
        data.message.trim()
    ) {

        const textDiv =
            document.createElement("div");

        textDiv.className =
            "message-text";

        textDiv.textContent =
            data.message;


        messageDiv.appendChild(
            textDiv
        );

    }


    // =================================================
    // DATE / TIME
    // =================================================

    if (data.createdAt) {

        const timeDiv =
            document.createElement("div");

        timeDiv.className =
            "message-time";


        const date =
            new Date(
                data.createdAt
            );


        timeDiv.textContent =
            date.toLocaleString();


        messageDiv.appendChild(
            timeDiv
        );

    }


    // =================================================
    // ADD TO CHAT
    // =================================================

    chatMessages.appendChild(
        messageDiv
    );


    // =================================================
    // AUTO SCROLL
    // =================================================

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


// =====================================================
// LOAD OLD MESSAGES
// =====================================================

async function loadMessages() {

    if (!token) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/messages",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "Messages response:",
            data
        );


        if (!response.ok) {

            console.error(
                data.message
            );

            return;
        }


        // Clear existing messages

        if (chatMessages) {

            chatMessages.innerHTML =
                "";

        }


        // Display messages

        if (
            data.data &&
            Array.isArray(data.data)
        ) {

            data.data.forEach(
                function (message) {

                    createMessage(
                        message
                    );

                }
            );

        }


    } catch (error) {

        console.error(
            "Load messages error:",
            error
        );

    }

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadMessages();


// =====================================================
// LOGOUT
// =====================================================

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "../login/login.html";

        }
    );

}