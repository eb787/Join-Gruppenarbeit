/**
 * This function is used to authenticate the user during login
 * Checks if both email and password are provided
 * Checks if the user with the provided email exists
 * Creates a folder for the user and saves login data locally
 */
async function userLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.querySelector('.wrong_data_alert');
    resetErrorMessage(errorMessage);

    if (!email || !password) return showErrorMessage(errorMessage, "Please fill in all fields.");

    const userData = await checkIfContactExists(email);
    if (!userData) return showErrorMessage(errorMessage, "User not found.");
    if (userData.password !== password) return showErrorMessage(errorMessage, "Incorrect password.");

    await createUserFolder(userData);
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('greetingShown', 'false');
    window.location.href = "./HTML/summary.html";
}


/**
 * This function sets the greeting flag for the user
 * 
 */
function setGreetingFlag() {
    if (!localStorage.getItem('greetingShown')) {
        localStorage.setItem('greetingShown', 'true'); 
    }
}


/**
 * This function checks if a user with the given email exists
 * @param {string} email - The email address of the user
 * @returns {Object|null} - Returns the user data if the user exists, otherwise null
 */
async function checkIfContactExists(email) {
    const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

    try {
        const res = await fetch(`${Base_URL}/logindata.json`);
        const data = await res.json();
        return findUserByEmail(data, email);
    } catch (error) {
        console.error("Error fetching login data:", error);
        return null;
    }
}


/**
 * This function searches for a user by their email address in the data
 * @param {Object} data - The user data from the database
 * @param {string} email - The email address of the user
 * @returns {Object|null} - Returns the user data if a match is found, otherwise null
 */
function findUserByEmail(data, email) {
    for (let id in data) {
        if (data[id].email === email) return { ...data[id], userId: id };
    }
    return null;
}


/**
 * This function resets the error message by removing its display
 * @param {HTMLElement} errorMessage - The DOM element containing the error message
 */
function resetErrorMessage(errorMessage) {
    errorMessage.classList.remove("show");
}


/**
 * This function displays an error message when there's an issue with the login
 * @param {string} message - The message to display
 */
function showErrorMessage(errorMessage, message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
}


/**
 * This function creates a folder for the user in the Firebase database
 * @param {Object} userData - The user data to be stored
 */
async function createUserFolder(userData) {
    const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

    const userFolderURL = `${Base_URL}/currentUser.json`;
    const userFolderData = { email: userData.email, name: userData.name };
    try {
        const response = await fetch(userFolderURL, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userFolderData),
        });
        if (!response.ok) throw new Error("Error creating user folder");
        console.log("User folder created:", await response.json());
    } catch (error) {
        console.error("Error creating user folder:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const errorMessage = document.querySelector('.wrong_data_alert');
    const toggleIcon = document.getElementById('togglePasswordVisibility');
    const lockIcon = document.getElementById('lockIcon');

    // 🔐 Passwort Sichtbarkeit
    passwordInput.addEventListener('input', function () {
        const hasContent = passwordInput.value.length > 0;
        lockIcon.style.display = hasContent ? 'none' : 'inline';
        toggleIcon.style.display = hasContent ? 'inline' : 'none';
    });

    toggleIcon.addEventListener('click', function () {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        toggleIcon.src = isPassword 
            ? "./assets/icons/visibility.svg"
            : "./assets/icons/visibility_off.svg";
    });

    // ✅ Email-Feld validieren beim Verlassen
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (!email.includes("@")) {
            showErrorMessage(errorMessage, "Please enter a valid email address.");
        } else {
            resetErrorMessage(errorMessage);
        }
    });

    // ✅ Passwort-Feld validieren beim Verlassen
    passwordInput.addEventListener('blur', () => {
        const password = passwordInput.value.trim();
        if (password.length < 4) {
            showErrorMessage(errorMessage, "Password must be at least 4 characters long.");
        } else {
            resetErrorMessage(errorMessage);
        }
    });
});



