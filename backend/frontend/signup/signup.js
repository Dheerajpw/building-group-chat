const signupForm = document.getElementById("signupForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


// ===============================
// SHOW / HIDE PASSWORD
// ===============================

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁";

    }

});


toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPasswordInput.type === "password") {

        confirmPasswordInput.type = "text";
        toggleConfirmPassword.textContent = "🙈";

    } else {

        confirmPasswordInput.type = "password";
        toggleConfirmPassword.textContent = "👁";

    }

});


// ===============================
// SIGNUP
// ===============================

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearErrors();


    // ===============================
    // GET VALUES
    // ===============================

    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const phone =
        phoneInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    let isValid = true;


    // ===============================
    // NAME VALIDATION
    // ===============================

    if (name.length < 3) {

        showError(
            "nameError",
            "Name must contain at least 3 characters."
        );

        isValid = false;
    }


    // ===============================
    // EMAIL VALIDATION
    // ===============================

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        showError(
            "emailError",
            "Please enter a valid email address."
        );

        isValid = false;
    }


    // ===============================
    // PHONE VALIDATION
    // ===============================

    const phonePattern =
        /^[0-9]{10}$/;


    if (!phonePattern.test(phone)) {

        showError(
            "phoneError",
            "Phone number must contain 10 digits."
        );

        isValid = false;
    }


    // ===============================
    // PASSWORD VALIDATION
    // ===============================

    if (password.length < 8) {

        showError(
            "passwordError",
            "Password must contain at least 8 characters."
        );

        isValid = false;
    }


    // ===============================
    // CONFIRM PASSWORD
    // ===============================

    if (password !== confirmPassword) {

        showError(
            "confirmPasswordError",
            "Passwords do not match."
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
    // SEND DATA TO BACKEND
    // ===============================

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/signup",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    email: email,

                    phone: phone,

                    password: password

                })
            }
        );


        const data =
            await response.json();


        console.log(
            "Signup response:",
            data
        );


        // ===============================
        // BACKEND ERROR
        // ===============================

        if (!response.ok) {

            alert(
                data.message ||
                "Signup failed"
            );

            return;
        }


        // ===============================
        // SIGNUP SUCCESS
        // ===============================

        alert(
            "Signup successful! You can now login."
        );


        // Redirect to login page

        window.location.href =
            "http://127.0.0.1:5500/backend/frontend/login/login.html";


    } catch (error) {

        console.error(
            "Signup Error:",
            error
        );


        alert(
            "Unable to connect to server. Please make sure backend is running."
        );

    }

});


// ===============================
// SHOW ERROR
// ===============================

function showError(elementId, message) {

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