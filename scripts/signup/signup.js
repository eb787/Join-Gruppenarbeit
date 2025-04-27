/**
 * Array of colors used for contact avatars.
 * @type {string[]}
 */
const contactColorArray = [
  "#FC71FF", "#6E52FF", "#9327FF", "#FFBB2B", "#FF4646",
  "#00BEE8", "#0038FF", "#FF7A00", "#1FD7C1", "#462F8A", "#f0eded"
];


/**
 * Disables submit initially and listens for form input.
 */
function enableSubmitButton() {
  const btn = document.getElementById("signup_btn");
  btn.disabled = true;
  document.querySelectorAll(
    "#name, #email, #password, #confirm_password, #privacy_checkbox"
  ).forEach(el => el.addEventListener("input", checkFormValidity));
}


/**
 * Validates form and toggles submit button.
 */
function checkFormValidity() {
  const name = val("name"), email = val("email");
  const pw = val("password"), cpw = val("confirm_password");
  const cb = document.getElementById("privacy_checkbox").checked;
  const valid = name && email && pw && cpw && pw === cpw;

  if (valid && !cb) showErrorMessage("Please accept the privacy policy.", "privacy_checkbox");
  else removeFieldError("privacy_checkbox");

  document.getElementById("signup_btn").disabled = !(valid && cb);
}


/**
 * Handles sign-up: validates, checks duplicates, saves user.
 */
async function addUserSignUp() {
  const name = val("name"), email = val("email");
  const pw = val("password"), cpw = val("confirm_password");
  const cb = document.getElementById("privacy_checkbox").checked;

  if (!checkInput(name, email, pw, cpw, cb)) return;
  if (await checkIfContactExists(email)) return showErrorMessage("Email already exists.", "email");

  await saveContact(email, name, pw);
  await addContactLogin({ name, email, password: pw });

  document.getElementById("successful_signin_btn").style.display = "flex";
  resetFormFields();
  setTimeout(() => location.href = "../index.html", 2000);
}


/**
 * Adds user to contact list & saves to server.
 * @param {Object|null} userData
 */
async function addContactLogin(userData = null) {
  const contact = userData ?? collectContactData();
  contact.color = globalIndex % contactColorArray.length;
  contact.name = contact.name || "No Name";
  globalIndex++; saveGlobalIndex();

  const group = await getData("/contacts");
  const letter = getFirstLetter(contact.name);
  const id = Object.keys(group[letter] || {}).length;

  (group[letter] ||= {})[id] = contact;
  await postData(`/contacts/${letter}`, group[letter]);

  if (!userData) clearInputsAndClose(), index = id, getUsersList();
}


/**
 * Validates user input for form.
 * @returns {boolean}
 */
function checkInput(name, email, pw, cpw, cb) {
  if (!name || !email || !pw || !cpw) return false;
  if (!email.includes("@")) return false;
  if (pw.length < 4) return false;
  if (pw !== cpw) return false;
  if (!cb) return false;
  return true;
}


/**
 * Shorthand to get trimmed input value by ID.
 * @param {string} id
 * @returns {string}
 */
const val = id => document.getElementById(id).value.trim();


/**
 * Resets all form inputs to their initial state.
 */
function resetFormFields() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirm_password").value = "";
  document.getElementById("privacy_checkbox").checked = false;
}


/**
 * Checks whether the given email address already exists in the database.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function checkIfContactExists(email) {
  const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";
  const url = `${Base_URL}/logindata.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data && Object.values(data).some(
      (contact) => contact.email.toLowerCase() === email.toLowerCase()
    );    
  } catch (error) {
    console.error("Error checking Firebase data:", error);
    return false;
  }
}


/**
 * Saves the new user's login data to Firebase.
 * @param {string} email
 * @param {string} name
 * @param {string} password
 */
async function saveContact(email, name, password) {
  const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";
  const personData = { email, name, password };
  const url = `${Base_URL}/logindata.json`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(personData),
    });

    if (!response.ok) throw new Error("Error saving contact");
    await response.json();
  } catch (error) {
    console.error("Error saving contact:", error);
  }
}


/**
 * Stores the current field-specific error messages.
 * @type {Object.<string, string>}
 */
let fieldErrors = {};


/**
 * Displays an error message for a specific field.
 * The message will appear in the global error display container.
 *
 * @param {string} message - The error message to show.
 * @param {string} fieldId - The ID of the input field related to the error.
 */
function showErrorMessage(message, fieldId) {
  fieldErrors[fieldId] = message;
  updateErrorMessage();
}


/**
 * Removes the error message for a specific field.
 * If there are no remaining errors, the error container is hidden.
 *
 * @param {string} fieldId - The ID of the input field whose error should be removed.
 */
function removeFieldError(fieldId) {
  delete fieldErrors[fieldId];
  updateErrorMessage();
}


/**
 * Updates the error display container in the UI based on the current field errors.
 * Shows the first error message in the list or hides the container if there are none.
 */
function updateErrorMessage() {
  const errorMessageElement = document.querySelector(".wrong_data_alert");
  const firstErrorKey = Object.keys(fieldErrors)[0];

  if (firstErrorKey) {
    errorMessageElement.textContent = fieldErrors[firstErrorKey];
    errorMessageElement.classList.add("show");
    errorMessageElement.style.opacity = 1;
  } else {
    errorMessageElement.classList.remove("show");
    errorMessageElement.style.opacity = 0;
    errorMessageElement.textContent = "";
  }
}


/**
 * Handles input validation UI and toggling of password visibility.
 * Sets up event listeners for various form inputs (name, email, password, confirm password).
 */
document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("privacy_checkbox");
  checkbox.addEventListener("change", checkFormValidity);


  /**
   * Removes the error message for a specific field and triggers an update to the error message UI.
   * @param {string} fieldId - The ID of the field to remove the error for.
   */
  function removeFieldError(fieldId) {
    delete fieldErrors[fieldId];
    updateErrorMessage();
  }


  /**
   * Toggles password visibility and changes the icon accordingly for a given password field.
   * @param {string} fieldId - The ID of the password field.
   * @param {string} iconId - The ID of the icon to toggle visibility.
   * @param {string} lockIconId - The ID of the lock icon.
   */
  function togglePasswordVisibility(fieldId, iconId, lockIconId) {
    const passwordField = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);
    const lockIcon = document.getElementById(lockIconId);

    passwordField.addEventListener("input", function () {
      const hasValue = passwordField.value.length > 0;
      icon.style.display = hasValue ? "block" : "none";
      lockIcon.style.display = hasValue ? "none" : "block";
    });

    icon.addEventListener("click", function () {
      const isVisible = passwordField.type === "text";
      passwordField.type = isVisible ? "password" : "text";
      icon.src = isVisible
        ? "../assets/icons/visibility_off.svg"
        : "../assets/icons/visibility.svg";
    });
  }


  // Initialize password visibility toggle for both password and confirm password fields
  togglePasswordVisibility("password", "togglePasswordVisibility", "togglePassword");
  togglePasswordVisibility("confirm_password", "toggleConfirmVisibility", "toggleConfimrPassword");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm_password");


  /**
   * Validates the name input on blur (when the user leaves the input field).
   * Checks if the name is not empty and follows the valid format (letters and certain characters).
   */
  nameInput.addEventListener("blur", () => {
    const name = nameInput.value.trim();
    const nameRegex = /^[a-zA-ZäöüÄÖÜß\s'-]+$/;

    if (name === "") {
      showErrorMessage("Please enter your name.", "name");
    } else if (!nameRegex.test(name)) {
      showErrorMessage("Please enter a valid name (letters only).", "name");
    } else {
      removeFieldError("name");
    }
  });


  /**
   * Validates the name input on every change (input event).
   * Ensures that the name follows the valid format while typing.
   */
  nameInput.addEventListener("input", () => {
    const name = nameInput.value.trim();
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (name !== "" && nameRegex.test(name)) {
      removeFieldError("name");
    }
  });


  /**
   * Validates the email input on blur (when the user leaves the input field).
   * Ensures the email is not empty, contains "@" symbol, and is not already in the system.
   */
  emailInput.addEventListener("blur", async () => {
    const email = emailInput.value.trim();

    if (email === "") {
      showErrorMessage("Please enter your email address.", "email");
    } else if (!email.includes("@")) {
      showErrorMessage("Please enter a valid email address.", "email");
    } else if (await checkIfContactExists(email)) {
      showErrorMessage("A contact with this email address already exists.", "email");
    } else {
      removeFieldError("email");
    }
  });


  /**
   * Validates the email input on every change (input event).
   * Ensures the email is valid and not already in the system.
   */
  emailInput.addEventListener("input", async () => {
    const email = emailInput.value.trim();
    if (email.includes("@") && !(await checkIfContactExists(email))) {
      removeFieldError("email");
    }
  });


  /**
   * Validates the password input on blur (when the user leaves the input field).
   * Ensures the password is not empty and meets the minimum length requirement.
   */
  passwordInput.addEventListener("blur", () => {
    const password = passwordInput.value.trim();
    if (password === "") {
      showErrorMessage("Please enter your password.", "password");
    } else if (password.length < 4) {
      showErrorMessage("Password must be at least 4 characters long.", "password");
    } else {
      removeFieldError("password");
    }
  });


  /**
   * Validates the password input on every change (input event).
   * Ensures that the password meets the minimum length requirement while typing.
   */
  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value.trim();
    if (password.length >= 4) {
      removeFieldError("password");
    }
  });


  /**
   * Validates the confirm password input on blur (when the user leaves the input field).
   * Ensures the confirm password matches the entered password.
   */
  confirmPasswordInput.addEventListener("blur", () => {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (confirmPassword === "") {
      showErrorMessage("Please confirm your password.", "confirm_password");
    } else if (password !== confirmPassword) {
      showErrorMessage("Passwords do not match.", "confirm_password");
    } else {
      removeFieldError("confirm_password");
    }
  });


  /**
   * Validates the confirm password input on every change (input event).
   * Ensures that the confirm password matches the entered password while typing.
   */
  confirmPasswordInput.addEventListener("input", () => {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (confirmPassword.length > 0 && password === confirmPassword) {
      removeFieldError("confirm_password");
    }
  });
});