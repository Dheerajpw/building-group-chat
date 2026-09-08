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
// LOGIN VALIDATION
// ===============================

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    clearErrors();

    const identifier =
        loginId.value.trim();

    const passwordValue =
        password.value;

    let isValid = true;


    // Check email or phone
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


    // Password
    if (passwordValue === "") {

        showError(
            "passwordError",
            "Please enter your password."
        );

        isValid = false;
    }


    // Successful validation
    if (isValid) {

        alert("Login validation successful!");

        loginForm.reset();
    }

});


// ===============================
// FUNCTIONS
// ===============================

function showError(
    elementId,
    message
) {

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