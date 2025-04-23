let errorMessageElement;
const fieldErrors = {};

/**
 * Displays an error message on the form.
 * @param {string} message - The message to display.
 * @param {string} fieldId - The field identifier.
 */
function showErrorMessage(message, fieldId) {
  fieldErrors[fieldId] = message;
  updateErrorDisplay();
}


/**
 * Removes the error message for a specific field.
 * @param {string} fieldId - The field identifier.
 */
function removeErrorMessage(fieldId) {
  delete fieldErrors[fieldId];
  updateErrorDisplay();
}


/**
 * Updates the error message element with the first error.
 */
function updateErrorDisplay() {
  if (!errorMessageElement) return;
  const firstKey = Object.keys(fieldErrors)[0];
  if (firstKey) {
    errorMessageElement.textContent = fieldErrors[firstKey];
    errorMessageElement.classList.add("show");
  } else {
    errorMessageElement.textContent = "";
    errorMessageElement.classList.remove("show");
  }
}


/**
 * Authenticates the user during login.
 * Stores login state and redirects on success.
 */
async function userLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const userData = await checkIfContactExists(email);

  if (!email || !password) {
    return showErrorMessage("Please fill in all fields.", "form");
  }
  if (!userData) {
    return showErrorMessage("User not found.", "form");
  }
  if (userData.password !== password) {
    return showErrorMessage("Incorrect password.", "form");
  }

  await createUserFolder(userData);
  localStorage.setItem("userLoggedIn", "true");
  localStorage.setItem("greetingShown", "false");
  window.location.href = "./HTML/summary.html";
}


/**
 * Creates a user folder in the database.
 * @param {Object} userData - The user data to be stored.
 */
async function createUserFolder(userData) {
  const Base_URL =
    "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";
  const userFolderURL = `${Base_URL}/currentUser.json`;
  const userFolderData = { email: userData.email, name: userData.name };

  try {
    await fetch(userFolderURL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userFolderData),
    });
  } catch (error) {}
}


/**
 * Checks if a contact with the given email exists.
 * @param {string} email - User's email address.
 * @returns {Promise<Object|null>}
 */
async function checkIfContactExists(email) {
  const Base_URL =
    "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";
  try {
    const res = await fetch(`${Base_URL}/logindata.json`);
    const data = await res.json();
    return findUserByEmail(data, email);
  } catch {
    return null;
  }
}


/**
 * Finds user data by email in the dataset.
 * @param {Object} data - The user dataset.
 * @param {string} email - User's email address.
 * @returns {Object|null}
 */
function findUserByEmail(data, email) {
  for (let id in data) {
    if (data[id].email === email) return { ...data[id], userId: id };
  }
  return null;
}


/**
 * Initializes the event listeners once the DOM is fully loaded.
 *
 * Handles password input changes:
 * - Toggles visibility of lock and toggle icons.
 * - Removes password error if length >= 4.
 */
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const emailInput = document.getElementById("email");
  const toggleIcon = document.getElementById("togglePasswordVisibility");
  const lockIcon = document.getElementById("lockIcon");
  errorMessageElement = document.querySelector(".wrong_data_alert");

  passwordInput.addEventListener("input", () => {
    const hasContent = passwordInput.value.length > 0;
    lockIcon.style.display = hasContent ? "none" : "inline";
    toggleIcon.style.display = hasContent ? "inline" : "none";

    if (passwordInput.value.length >= 4) {
      removeErrorMessage("password");
    }
  });


  /**
   * Toggles the password visibility when the toggle icon is clicked.
   * Also switches the icon between "visibility" and "visibility_off".
   */
  toggleIcon.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleIcon.src = isPassword
      ? "./assets/icons/visibility.svg"
      : "./assets/icons/visibility_off.svg";
  });

  
  /**
   * Validates the email input on blur (when user leaves the input):
   * - Checks if email is entered.
   * - Validates basic format.
   * - Checks if the email exists in the system.
   * - Shows or removes error messages accordingly.
   */
  emailInput.addEventListener("blur", async () => {
    const email = emailInput.value.trim();
    if (!email) {
      showErrorMessage("Email is required.", "email");
    } else if (!email.includes("@")) {
      showErrorMessage("Please enter a valid email address.", "email");
    } else if (!(await checkIfContactExists(email))) {
      showErrorMessage("User not found.", "email");
    } else {
      removeErrorMessage("email");
    }
  });


  /**
   * Validates the password input on blur:
   * - Checks if password is entered.
   * - Validates minimum length.
   * - Shows or removes error messages accordingly.
   */
  passwordInput.addEventListener("blur", () => {
    const password = passwordInput.value.trim();
    if (!password) {
      showErrorMessage("Password is required.", "password");
    } else if (password.length < 4) {
      showErrorMessage(
        "Password must be at least 4 characters long.",
        "password"
      );
    } else {
      removeErrorMessage("password");
    }
  });
});
