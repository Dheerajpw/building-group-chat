const loginForm =
    document.getElementById("loginForm");

const loginId =
    document.getElementById("loginId");

const password =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");


// ===============================
// SHOW / HIDE PASSWORD
// ===============================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.textContent = "🙈";

    } else {

        password.type = "password";

        togglePassword.textContent = "👁";

    }

});


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearErrors();


    const identifier =
        loginId.value.trim();

    const passwordValue =
        password.value;


    let isValid = true;


    // ===============================
    // VALIDATE EMAIL OR PHONE
    // ===============================

    if (identifier === "") {

        showError(
            "loginIdError",
            "Please enter your email or phone number."
        );

        isValid = false;

    } else {

        const isEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(identifier);

        const isPhone =
            /^[0-9]{10}$/
                .test(identifier);


        if (!isEmail && !isPhone) {

            showError(
                "loginIdError",
                "Enter a valid email or 10-digit phone number."
            );

            isValid = false;
        }

    }


    // ===============================
    // PASSWORD VALIDATION
    // ===============================

    if (passwordValue === "") {

        showError(
            "passwordError",
            "Please enter your password."
        );

        isValid = false;

    }


    // ===============================
    // STOP IF VALIDATION FAILED
    // ===============================

    if (!isValid) {

        return;

    }


    // ===============================
    // LOGIN API
    // ===============================

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email: identifier,

                        password: passwordValue

                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Login response:",
            data
        );


        // ===============================
        // LOGIN FAILED
        // ===============================

        if (!response.ok) {

            alert(
                data.message ||
                "Login failed"
            );

            return;

        }


        // ===============================
        // SAVE JWT TOKEN
        // ===============================

        localStorage.setItem(
            "token",
            data.token
        );


        // ===============================
        // SAVE USER DATA
        // ===============================

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        // ===============================
        // LOGIN SUCCESS
        // ===============================

        alert("Login successful!");


        // ===============================
        // GO TO CHAT PAGE
        // ===============================

        window.location.href =
            "http://127.0.0.1:5500/backend/frontend/chat/index.html";


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

});


// ===============================
// SHOW ERROR
// ===============================

function showError(
    elementId,
    message
) {

    const element =
        document.getElementById(elementId);


    if (element) {

        element.textContent =
            message;

    }

}


// ===============================
// CLEAR ERRORS
// ===============================

function clearErrors() {

    document
        .querySelectorAll("small")
        .forEach((element) => {

            element.textContent = "";

        });

}