let contactsData = [];
let oldPictureHTML = "";
let activeContact = null;
let allEmpty = true;

/**
 * Opens the detailed view of a contact when clicked.
 * @param {string} contactsId - The contact's ID composed of the first letter and contact index.
 * @param {string} letter - The first letter of the contact's name.
 */
async function openContactBigMiddle(contactsId, letter) {
  let contactMiddle = getContactElement();
  if (!contactMiddle) return;
  let { firstLetter, contactIndex } = parseContactId(contactsId);
  let user = await fetchUser(firstLetter, contactIndex);
  if (user) {
    let contactsIdColor = `${firstLetter}-${user.name.toLowerCase()}`;
    let color = getUserColor(contactsIdColor, letter);
    renderContact(contactMiddle, user, contactIndex, firstLetter, color);
    document.getElementById('contact-big-middle').style.display = 'flex';
    highlightActiveContact(contactsId);
    if (window.innerWidth < 1000) {
      contactMiddle.classList.add("show");
      document.querySelector(".contact_Detail").classList.add("show");
      hideContactList();
    }
  } else {
    console.error("Kein Benutzer gefunden mit ID:", contactsId);
  }
}

/**
 * Highlights the currently active contact when it's clicked.
 * @param {string} contactsId - The contact's ID.
 */
function highlightActiveContact(contactsId) {
  if (activeContact) {
    activeContact.style.backgroundColor = "";
    activeContact.style.color = "";
  }
  let contactElement = document.getElementById(`contact-card-${contactsId}`);
  if (contactElement) {
    contactElement.style.backgroundColor = "#2A3647";
    contactElement.style.color = "white";
    activeContact = contactElement;
  }
  checkScreenSize();
}

/**
 * Retrieves the element for the contact details section.
 * @returns {HTMLElement|null} - The contact detail element.
 */
function getContactElement() {
  let contactMiddle = document.getElementById("contact-big-middle");
  if (!contactMiddle) console.error("Element mit ID 'contact-big-middle' nicht gefunden.");
  return contactMiddle;
}

/**
 * Parses the contact's ID to extract the first letter and contact index.
 * @param {string} contactsId - The contact's ID.
 * @returns {Object} - An object containing the first letter and contact index.
 */
function parseContactId(contactsId) {
  let [firstLetter, contactIndex] = contactsId.split("-");
  return { firstLetter, contactIndex };
}

/**
 * Fetches the user data based on the first letter and contact index.
 * @param {string} firstLetter - The first letter of the contact's name.
 * @param {number} contactIndex - The contact's index in the list.
 * @returns {Object|null} - The user data, or null if not found.
 */
async function fetchUser(firstLetter, contactIndex) {
  try {
    let contactsGroup = await getData(`/contacts/${firstLetter}`);
    return contactsGroup?.[contactIndex] || null;
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    return null;
  }
}

/**
 * Retrieves the color for a user based on their contact ID, and stores it in localStorage.
 * @param {string} contactsId - The contact's ID.
 * @param {string} letter - The first letter of the contact's name.
 * @returns {string} - The color for the contact.
 */
function getUserColor(contactsId, letter) {
  let key = `contactColor_${letter}_${contactsId}`;
  let storedColor = localStorage.getItem(key);
  if (storedColor) {
    return storedColor;
  } else {
    let colorIndex = Math.abs(hashCode(contactsId)) % contactColorArray.length;
    let color = contactColorArray[colorIndex];
    localStorage.setItem(key, color);
    return color;
  }
}

/**
 * Generates a hash code for a string.
 * @param {string} str - The string to generate the hash for.
 * @returns {number} - The generated hash code.
 */
function hashCode(str) {
  return str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

/**
 * Renders the contact details into the contact detail section.
 * @param {HTMLElement} contactMiddle - The contact details container element.
 * @param {Object} user - The user data to render.
 * @param {number} contactIndex - The contact's index.
 * @param {string} firstLetter - The first letter of the contact's name.
 * @param {string} color - The contact's color.
 */
function renderContact(contactMiddle, user, contactIndex, firstLetter, color) {
  contactMiddle.innerHTML = contactCardMiddle(user, contactIndex, firstLetter, color);
}

/**
 * Closes the contact details section.
 */
function closeContactBigMiddle() {
  let contactMiddle = document.getElementById("contact-big-middle");
  if (contactMiddle) {
    contactMiddle.style.display = "none";
  }
}

/**
 * Opens the contact editing form with the current contact's data.
 * @param {string} contactsId - The contact's ID.
 * @param {string} firstLetter - The first letter of the contact's name.
 * @param {string} color - The contact's color.
 */
async function editContact(contactsId, firstLetter, color) {
  openContactBig();
  closeWindowMobile();
  editContactMobile()
  contactcardHeadlineEdit()
  let contact = await getData(`/contacts/${firstLetter}/${contactsId}`);
  if (contact) {
    document.getElementById('name_input').value = contact.name;
    document.getElementById('email_input').value = contact.email;
    document.getElementById('tel_input').value = contact.number;
    let saveButton = document.getElementById('save-button');
    updatePicture(contact, color);
    disabledButton();
    saveButton.onclick = async function () {
      await saveEditedContact(contactsId, firstLetter, color,);
    };
  }
}

/**
 * Saves the edited contact data and updates the UI.
 * @param {string} contactsId - The contact's ID.
 * @param {string} firstLetter - The first letter of the contact's name.
 */
async function saveEditedContact(contactsId, firstLetter) {
  const email = document.getElementById('email_input').value;
  if (!validateInputs(email)) return;
  let contactIndex = parseInt(localStorage.getItem(`${contactsId}_index`)) || 0;
  saveGlobalIndex();
  let existingUser = await fetchUser(firstLetter, contactIndex);
  let updatedContact = getUpdatedContact(existingUser);
  await postData(`/contacts/${firstLetter}/${contactsId}`, updatedContact);
  let color = updatedContact.color;
  localStorage.setItem(`contactColor_${firstLetter}_${contactsId}`, color);
  updateContactUI(contactsId, updatedContact, firstLetter);
  let contactsIdMiddle = `${firstLetter}-${contactsId}`;
  openContactBigMiddle(contactsIdMiddle, firstLetter);
  closeContactBig();
  clearInputsAndClose();
  closeEditMobile();
}

/**
 * Updates the contact's information in the UI after saving the edit.
 * @param {string} contactsId - The contact's ID.
 * @param {Object} updatedContact - The updated contact data.
 * @param {string} letter - The first letter of the contact's name.
 */
function updateContactUI(contactsId, updatedContact, letter) {
  let nameInputIdOne = document.getElementById(`contact_name_one_${contactsId}`);
  let emailInputId = document.getElementById(`contact_email_${contactsId}`);
  let telInputId = document.getElementById(`contact_tel_${contactsId}`);
  if (nameInputIdOne) nameInputIdOne.textContent = updatedContact.name;
  if (emailInputId) emailInputId.textContent = updatedContact.email;
  if (telInputId) telInputId.textContent = updatedContact.number;
  getUsersList()
}

/**
 * Returns the initials of the contact's name.
 * @param {string} name - The full name of the contact.
 * @returns {string} - The initials of the contact's name.
 */
function getInitials(name) {
  let nameParts = name.trim().split(" ");
  let initials = nameParts[0].charAt(0).toUpperCase();
  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  return initials;
}

/**
 * Disables the save button if required fields are not filled.
 */
function disabledButton() {
  let saveButton = document.getElementById('save-button');
  let nameInput = document.getElementById('name_input');
  let emailInput = document.getElementById('email_input');
  if (nameInput.value.trim() === "" || emailInput.value.trim() === "") {
    saveButton.disabled = true;
  } else {
    saveButton.disabled = false;
  }
  nameInput.addEventListener('input', disabledButton);
  emailInput.addEventListener('input', disabledButton);
}

/**
 * Returns the updated contact data.
 * @param {Object} existingUser - The current contact data.
 * @returns {Object} - The updated contact data.
 */
function getUpdatedContact(existingUser) {
  let color = existingUser?.color ?? (globalIndex % contactColorArray.length);
  return {
    "name": document.getElementById('name_input').value.trim(),
    "email": document.getElementById('email_input').value.trim(),
    "number": document.getElementById('tel_input').value.trim(),
    "color": color
  };
}

/**
 * Updates the contact picture based on the contact's initials and color.
 * @param {Object} contact - The contact data.
 * @param {string} color - The contact's color.
 */
function updatePicture(contact, color) {
  let contactPicture = document.getElementById('picture-edit');
  let oldPictures = document.getElementsByClassName('pic-edit');
  Array.from(oldPictures).forEach(pic => pic.style.display = 'none');
  if (!oldPictureHTML) {
    oldPictureHTML = contactPicture.innerHTML;
  }
  let nameParts = contact.name.trim().split(" ");
  let initials = nameParts[0].charAt(0).toUpperCase();
  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  contactPicture.innerHTML = `
      <h4 class="contact_abbreviation_big" style="background-color:${color};">${initials}</h4>
  `;
}

/**
 * Resets the contact picture to its original state if the old picture is available.
 * Restores the picture editing option if the picture is reset.
 */
function resetPicture() {
  let contactPicture = document.getElementById('picture-edit');
  if (oldPictureHTML) {
    contactPicture.innerHTML = oldPictureHTML;
    let restoredPicture = contactPicture.querySelector('.pic-edit');
    if (restoredPicture) {
      restoredPicture.style.display = 'flex';
    }
  }
}

/**
 * Opens the contact detail modal and displays the contact's information.
 * Adjusts the layout based on screen size.
 */
function openContactBig() {
  let backgroundDiv = document.getElementById('background_card');
  backgroundDiv.style.display = 'flex'; 
  backgroundDiv.classList.add('card_contact_background');
  document.getElementById('content-card-big').style.display = 'flex'; 
  if (window.innerWidth <= 1000) {
    document.querySelector('.card_contact').classList.add('show');
  }
  contactcardHeadline();
}

/**
 * Closes the contact detail modal when clicked outside the modal or on the close button.
 * Optionally accepts an event to detect if the close action is triggered from outside the modal.
 * @param {Event} [event=null] - The event that triggered the close action, if any.
 */
function closeContactBig(event = null) {
  let backgroundDiv = document.getElementById('background_card');
  if (event) {
    if (event.target.id !== 'background_card') return;
  }
  backgroundDiv.style.display = 'none';
  backgroundDiv.classList.remove('card_contact_background');
  document.getElementById('content-card-big').style.display = 'none';
}

/**
 * Updates the text and action of the cancel button based on whether the input fields are filled or not.
 * If the fields are empty, the cancel button will trigger the cancel action.
 * If the fields are filled, it will trigger the delete action.
 */
function updateCancelButton() {
  let inputs = document.querySelectorAll('#name_input, #email_input, #tel_input');
  let cancelButton = document.getElementById('cancel-button');
  inputs.forEach(input => {
    if (input.value.trim() !== "") {
      allEmpty = false;
    }
  });
  if (allEmpty) {
    cancelButton.innerText = "Cancel";
    cancelButton.setAttribute("onclick", "cancelStatus()");
  } else {
    cancelButton.innerText = "Delete";
    cancelButton.setAttribute("onclick", "deleteData()");
  }
}

/**
 * Validates the name, phone, and email inputs. Returns true if all inputs are valid.
 * @param {string} email - The email to validate.
 * @returns {boolean} - Whether the inputs are valid or not.
 */
// Validierungs-Wrapper
function validateInputs() {
  const nameValid = validateName();
  const emailValid = validateEmailSync(document.getElementById("email_input").value);
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


document.addEventListener("DOMContentLoaded", () => {
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
function validateEmailSync(email) {
  let emailInput = document.getElementById('email_input');

  if (isEmpty(email)) return show(emailInput, "Please enter an email!");
  if (!isValidEmail(email)) return show(emailInput, "Please enter a valid email address!");
  if (emailExists(email)) return show(emailInput, "This email already exists!");

  clearError(emailInput);
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('email_input').addEventListener('input', (e) => {
    validateEmailSync(e.target.value); // Übergib die E-Mail beim Tippen
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
function emailExists(email) {
  let firstLetter = /^[A-Z]/i.test(email[0]) ? email[0].toUpperCase() : "#";
  let group = contactsData[firstLetter] || {};
  return Object.values(group).some(c => c.email.toLowerCase() === email.toLowerCase());
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
