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
// VALIDATION
// ===============================

signupForm.addEventListener("submit", (event) => {

    event.preventDefault();

    clearErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword =
        confirmPasswordInput.value;

    let isValid = true;


    // Name validation
    if (name.length < 3) {

        showError(
            "nameError",
            "Name must contain at least 3 characters."
        );

        isValid = false;
    }


    // Email validation
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showError(
            "emailError",
            "Please enter a valid email address."
        );

        isValid = false;
    }


    // Phone validation
    const phonePattern =
        /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {

        showError(
            "phoneError",
            "Phone number must contain 10 digits."
        );

        isValid = false;
    }


    // Password validation
    if (password.length < 8) {

        showError(
            "passwordError",
            "Password must contain at least 8 characters."
        );

        isValid = false;
    }


    // Confirm password
    if (password !== confirmPassword) {

        showError(
            "confirmPasswordError",
            "Passwords do not match."
        );

        isValid = false;
    }


    // Successful validation
    if (isValid) {

        alert("Signup validation successful!");

        signupForm.reset();
    }

});


// ===============================
// FUNCTIONS
// ===============================

function showError(elementId, message) {

    document.getElementById(elementId)
        .textContent = message;
}


function clearErrors() {

    document
        .querySelectorAll("small")
        .forEach((element) => {

            element.textContent = "";
        });
}