const fieldErrors = {};


/**
 * Displays an error message for a specific field.
 * @param {string} message - The message to display.
 * @param {string} fieldId - The field identifier.
 */
function showErrorMessage(message, fieldId) {
  fieldErrors[fieldId] = message;
  updateErrorDisplay();

  if (fieldId === "form") {
    setTimeout(() => {
      
      if (fieldErrors["form"] === message) {
        removeErrorMessage("form");
      }
    }, 2500); 
  }
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
 * Validates the email input field.
 * Checks for presence, correct format, and user existence via async check.
 *
 * @param {string} email - The email address to validate.
 * @returns {Promise<boolean>} - Resolves to true if valid, otherwise false.
 */
async function validateEmail(email) {
  if (!email) {
    removeErrorMessage("email");
    return false;
  } else if (!email.includes("@")) {
    showErrorMessage("Please enter a valid email address.", "email");
    return false;
  } else if (!(await checkIfContactExists(email))) {
    showErrorMessage("User not found.", "email");
    return false;
  } else {
    removeErrorMessage("email");
    return true;
  }
}


/**
 * Validates the password input field.
 * Checks for presence and minimum length.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if valid, otherwise false.
 */
function validatePassword(password) {
  if (!password) {
    removeErrorMessage("password");
    return false;
  } else if (password.length < 4) {
    showErrorMessage("Wrong password", "password");
    return false;
  } else {
    removeErrorMessage("password");
    return true;
  }
}


/**
 * Validates the login form by checking both email and password fields.
 * If any errors are found, a general form error message is displayed.
 *
 * @returns {Promise<boolean>} - Resolves to true if the form is valid, otherwise false.
 */
async function validateLoginForm() {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  let emailValid = await validateEmail(email);
  let passwordValid = validatePassword(password);

  let isValid = emailValid && passwordValid;

  if (!isValid) {
    showErrorMessage("Please correct the highlighted fields.", "form");
  } else {
    removeErrorMessage("form");
  }

  return isValid;
}


/**
 * Updates the error display area with the first error message from fieldErrors.
 * Adds or removes the "show" class based on presence of errors.
 */
function updateErrorDisplay() {
  if (!errorMessageElement) return;
  let firstKey = Object.keys(fieldErrors)[0];
  if (firstKey) {
    errorMessageElement.textContent = fieldErrors[firstKey];
    errorMessageElement.classList.add("show");
  } else {
    errorMessageElement.textContent = "";
    errorMessageElement.classList.remove("show");
  }
}


/**
 * Logs in the user after validating the form.
 */
async function userLogin() {
  const isFormValid = await validateLoginForm();
  if (!isFormValid) return;

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const userData = await checkIfContactExists(email);

  if (!userData) return showErrorMessage("User not found.", "form");
  if (userData.password !== password) {
    return showErrorMessage("Incorrect password.", "form");
  }

  await createUserFolder(userData);
  localStorage.setItem("userLoggedIn", "true");
  localStorage.setItem("greetingShown", "false");
  window.location.href = "./HTML/summary.html";
}


/**
 * Stores the current user data in the database.
 * @param {Object} userData - User data to save.
 */
async function createUserFolder(userData) {
  const url = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/currentUser.json";
  const data = { email: userData.email, name: userData.name };

  try {
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error saving user folder:", error);
  }
}


/**
 * Checks if a user exists with the given email.
 * @param {string} email - Email address to check.
 * @returns {Promise<Object|null>} - Found user or null.
 */
async function checkIfContactExists(email) {
  const url = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/logindata.json";
  try {
    const res = await fetch(url);
    const data = await res.json();
    return findUserByEmail(data, email);
  } catch {
    return null;
  }
}


/**
 * Searches for a user in the dataset by email.
 * @param {Object} data - User dataset from DB.
 * @param {string} email - Email to find.
 * @returns {Object|null} - Matching user or null.
 */
function findUserByEmail(data, email) {
  const lowerCaseEmail = email.toLowerCase();
  for (let id in data) {
    if (data[id].email.toLowerCase() === lowerCaseEmail) {
      return { ...data[id], userId: id };
    }
  }
  return null;
}


/**
 * Initializes all required DOM elements and event listeners.
 */
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const emailInput = document.getElementById("email");
  const toggleIcon = document.getElementById("togglePasswordVisibility");
  const lockIcon = document.getElementById("lockIcon");
  errorMessageElement = document.querySelector(".wrong_data_alert");

  setupPasswordField(passwordInput, toggleIcon, lockIcon);
  setupEmailValidation(emailInput);
  setupPasswordValidation(passwordInput);
});


/* @param {HTMLElement} input - The password input field.
* @param {HTMLElement} toggleIcon - Icon for toggling visibility.
* @param {HTMLElement} lockIcon - Icon showing lock.
*/
function setupPasswordField(input, toggleIcon, lockIcon) {
 input.addEventListener("input", () => {
   const value = input.value.trim();
   const hasContent = value.length > 0;

   lockIcon.style.display = hasContent ? "none" : "inline";
   toggleIcon.style.display = hasContent ? "inline" : "none";

   if (!value) {
     removeErrorMessage("password");
   } else if (value.length < 4) {
     showErrorMessage("Wrong password", "password");
   } else {
     removeErrorMessage("password");
   }
 });

 toggleIcon.addEventListener("click", () => {
   const isPassword = input.type === "password";
   input.type = isPassword ? "text" : "password";
   toggleIcon.src = isPassword
     ? "./assets/icons/visibility.svg"
     : "./assets/icons/visibility_off.svg";
 });
}


/**
 * Sets up blur validation for the email input field.
 * @param {HTMLElement} input - The email input field.
 */
function setupEmailValidation(input) {
  input.addEventListener("blur", async () => {
    const email = input.value.trim();
    if (!email) {
      removeErrorMessage("email");
      return;
    }
    if (!email.includes("@")) {
      showErrorMessage("Please enter a valid email address.", "email");
    } else if (!(await checkIfContactExists(email))) {
      showErrorMessage("User not found.", "email");
    } else {
      removeErrorMessage("email");
    }
  });
  input.addEventListener("input", () => {
    if (input.value.trim() === "") {
      removeErrorMessage("email");
    }
  });
}


/**
 * Sets up blur validation for the password input field.
 * @param {HTMLElement} input - The password input field.
 */
function setupPasswordValidation(input) {
  input.addEventListener("blur", () => {
    const password = input.value.trim();
    if (!password) {
      removeErrorMessage("password");
      return;
    }

    if (password.length < 4) {
      showErrorMessage("Wrong password", "password");
    } else {
      removeErrorMessage("password");
    }
  });
}
