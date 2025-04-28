/**
 * Validates the name, phone, and email inputs. Returns true if all inputs are valid.
 * @param {string} email - The email to validate.
 * @returns {boolean} - Whether the inputs are valid or not.
 */
// Validierungs-Wrapper
function validateInputs() {
  const nameValid = validateName();
  const email = document.getElementById("email_input").value;
  const emailValid = validateEmailSync(email, originalEmail);
  const telValid = validateTelInput();

  return nameValid && emailValid && telValid;
}


/**
 * Validates the name input, ensuring it's not empty.
 * @returns {boolean} - Whether the name input is valid.
 */
/**
 * Validates the name input field.
 * Ensures the value is not empty, only contains letters, and has at least 3 characters.
 * @returns {boolean} - Whether the name input is valid.
 */
function validateName() {
  let nameInput = document.getElementById('name_input');
  let nameValue = nameInput.value.trim();
  let errorElement = document.getElementById('name_error');

  if (isEmpty(nameValue)) return showNameError(nameInput, errorElement, "Please enter a name!");
  if (!onlyLetters(nameValue)) return showNameError(nameInput, errorElement, "Only letters are allowed!");
  if (!hasMinLength(nameValue)) return showNameError(nameInput, errorElement, "The name must be at least 3 letters!");

  clearNameError(nameInput, errorElement);
  return true;
}


/**
 * Adds an event listener that runs after the DOM has fully loaded.
 * When typing in the name input field, the `validateName` function is called
 * to validate the input in real time.
 */
document.addEventListener("DOMContentLoaded", () => {
  /**
   * Event listener for the name input field.
   * Triggered on every input change.
   */
  document.getElementById('name_input').addEventListener('input', () => {
    validateName();
  });
});


/**
 * Checks if a string is empty.
 * @param {string} value - The string to check.
 * @returns {boolean} - True if the string is empty.
 */
function isEmpty(value) {
  return value === "";
}


/**
 * Checks if a string contains only letters (including German umlauts and ß).
 * @param {string} value - The string to validate.
 * @returns {boolean} - True if the string only contains letters and spaces.
 */
function onlyLetters(value) {
  return /^[a-zA-ZäöüÄÖÜß\s]+$/.test(value);
}


/**
 * Checks if a string has at least 3 characters.
 * @param {string} value - The string to check.
 * @returns {boolean} - True if the string has 3 or more characters.
 */
function hasMinLength(value) {
  return value.length >= 3;
}


/**
 * Displays an error message and marks the input as invalid.
 * @param {HTMLInputElement} input - The input element to mark.
 * @param {HTMLElement} errorEl - The element where the error message is displayed.
 * @param {string} message - The error message to show.
 * @returns {boolean} - Always returns false for validation flow.
 */
function showNameError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.add("input-error");
  return false;
}


/**
 * Clears the error message and removes the error class from the input.
 * @param {HTMLInputElement} input - The input element to clear.
 * @param {HTMLElement} errorEl - The element where the error message is shown.
 */
function clearNameError(input, errorEl) {
  errorEl.textContent = "";
  input.classList.remove("input-error");
}


/**
 * Validates the email input by checking for emptiness, format, and uniqueness.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid; otherwise, false.
 */
function validateEmailSync(email, original = "") {
  let emailInput = document.getElementById('email_input');
  if (isEmpty(email)) return show(emailInput, "Please enter an email!");
  if (!isValidEmail(email)) return show(emailInput, "Please enter a valid email address!");
  if (emailExists(email, original)) return show(emailInput, "This email already exists!");
  clearError(emailInput);
  return true;
}


/**
* Waits for the DOM to fully load before adding event listeners.
* Adds an input event listener to the email input field to validate the email in real-time.
*/
document.addEventListener("DOMContentLoaded", () => {
  /**
   * Input event listener for the email field.
   * Calls the `validateEmailSync` function with the current input value on each keystroke.
   * 
   * @param {Event} e - The input event containing the current value of the email input field.
   */
  document.getElementById('email_input').addEventListener('input', (e) => {
    validateEmailSync(e.target.value);
  });
});


/**
 * Validates if a given string follows a standard email format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email format is valid.
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


/**
 * Checks whether the email already exists in the contacts data.
 * @param {string} email - The email to check for duplicates.
 * @returns {boolean} - Returns true if the email already exists.
 */
function emailExists(email, original = "") {
  let firstLetter = /^[A-Z]/i.test(email[0]) ? email[0].toUpperCase() : "#";
  let group = contactsData[firstLetter] || {};
  return Object.values(group).some(c => {
    if (c.email.toLowerCase() === original.toLowerCase()) return false;
    return c.email.toLowerCase() === email.toLowerCase();
  });
}


/**
 * Displays an error message and marks the input as invalid.
 * @param {HTMLElement} input - The input element to mark.
 * @param {string} message - The error message to display.
 * @returns {boolean} - Always returns false for validation control flow.
 */
function show(input, message) {
  showError(input, message);
  return false;
}


/**
 * Validates the phone number input, ensuring it contains only numbers and is not empty.
 * @returns {boolean} - Whether the phone number input is valid.
 */
function validateTelInput() {
  const input = document.getElementById("tel_input");
  const error = document.getElementById("tel_error");
  const value = input.value.trim();
  const digitCount = (value.match(/[0-9]/g) || []).length;
  if (value === "") {
    error.textContent = "Please enter a phone number!";
    input.classList.add("input-error");
    return false;
  }
  if (!/^[0-9 +]+$/.test(value)) {
    error.textContent = "Only numbers, spaces and + are allowed!";
    input.classList.add("input-error");
    return false;
  }
  if (digitCount < 4) {
    error.textContent = "Phone number must be at least 4 digits!";
    input.classList.add("input-error");
    return false;
  }
  error.textContent = "";
  input.classList.remove("input-error");
  return true;
}


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("tel_input").addEventListener("input", () => {
    validateTelInput();
  });
});


/**
 * Displays an error message and highlights the input element with an error class.
 * @param {HTMLElement} inputElement - The input element to highlight.
 * @param {string} message - The error message to display.
 */
function showError(inputElement, message) {
  let errorElement = document.getElementById('email_error');
  errorElement.textContent = message;
  inputElement.classList.add("input-error");
}


/**
 * Clears the error message and removes the error highlight from the input element.
 * @param {HTMLElement} inputElement - The input element to clear errors from.
 */
function clearError(inputElement) {
  let errorElement = document.getElementById('email_error');
  errorElement.textContent = "";
  inputElement.classList.remove("input-error");
}


/**
 * Clears all input errors for name, email, and phone number fields.
 */
function clearAllErrors() {
  clearNameError(document.getElementById('name_input'), document.getElementById('name_error'));
  clearError(document.getElementById('email_input'));
  document.getElementById('tel_error').textContent = "";
  document.getElementById('tel_input').classList.remove("input-error");
}


/**
 * Closes the contact detail modal without saving any changes.
 */
function cancelStatus() {
  document.getElementById('content-card-big').style.display = 'none';
  closeContactBig();
}


/**
 * Resets the input fields to be empty and restores the cancel button's original functionality.
 * Deletes the contact's data from the input fields.
 */
function deleteData() {
  let cancelButton = document.getElementById('cancel-button');
  document.getElementById('email_input').value = "";
  document.getElementById('name_input').value = "";
  document.getElementById('tel_input').value = "";
  cancelButton.innerText = "Cancel";
  cancelButton.setAttribute("onclick", "cancelStatus()");
}


/**
 * Displays a success alert and reloads the user list after an action (like saving).
 * @param {string} currentLetter - The first letter of the contact's name.
 * @param {number} index - The index of the contact in the list.
 */
async function showAlertSuccess(currentLetter, index) {
  let mainDiv = document.getElementById('contact_Card');
  mainDiv.innerHTML += alertSuccess();
  let alert = document.getElementById('alert');
  setTimeout(() => {
    if (alert) {
      alert.remove();
    }
  }, 4000);
  await getUsersList();
  let contactsId = `${currentLetter}-${index}`;
  openContactBigMiddle(contactsId);
}


/**
 * This function shows the help icon on mobile screens (below 1000px width).
 */
function showHelpIconMobile() {
  let helpLink = document.getElementById("mobile_help_link");

  if (window.innerWidth <= 1000) {
    helpLink.style.display = "flex";
  } else {
    helpLink.style.display = "none";
  }
}


window.onresize = showHelpIconMobile;


/**
 * This function logs out the user by removing the 'userLoggedIn' flag from localStorage
 * and resetting the greetingShown flag.
 */
function logout() {
  localStorage.removeItem('userLoggedIn');
  localStorage.setItem('greetingShown', 'false');
}
