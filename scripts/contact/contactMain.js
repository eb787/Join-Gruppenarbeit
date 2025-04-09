let contactsData = [];
let oldPictureHTML = "";
let activeContact = null;
let allEmpty = true;

  // Opens the detailed view of a contact when clicked.
async function openContactBigMiddle(contactsId, letter) {
  let contactMiddle = getContactElement();
  if (!contactMiddle) return;
  let { firstLetter, contactIndex } = parseContactId(contactsId);
  let user = await fetchUser(firstLetter, contactIndex);
  if (user) {
    let contactsIdColor = `${firstLetter}-${user.name.toLowerCase()}`;
    let color = getUserColor(contactsIdColor, letter);
    renderContact(contactMiddle, user, contactIndex, firstLetter, color);
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

  // Highlights the currently active contact when it's clicked.
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

  // Retrieves the element for the contact details section.
function getContactElement() {
  let contactMiddle = document.getElementById("contact-big-middle");
  if (!contactMiddle) console.error("Element mit ID 'contact-big-middle' nicht gefunden.");
  return contactMiddle;
}

  // Parses the contacts ID to get the first letter and contact index.
function parseContactId(contactsId) {
  let [firstLetter, contactIndex] = contactsId.split("-");
  return { firstLetter, contactIndex };
}

  // Fetches the user data based on the first letter and contact index.
async function fetchUser(firstLetter, contactIndex) {
  try {
    let contactsGroup = await getData(`/contacts/${firstLetter}`);
    return contactsGroup?.[contactIndex] || null;
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    return null;
  }
}

  // Retrieves the color for a user based on their contact ID, and stores it in localStorage.
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

  // Generates a hash code for a string.
function hashCode(str) {
  return str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

  // Renders the contact details into the contact detail section.
function renderContact(contactMiddle, user, contactIndex, firstLetter, color) {
  contactMiddle.innerHTML = contactCardMiddle(user, contactIndex, firstLetter, color);
}

  // Closes the contact details section.
function closeContactBigMiddle() {
  let contactMiddle = document.getElementById("contact-big-middle");
  if (contactMiddle) {
    contactMiddle.style.display = "none";
  }
 
}

  // Opens the contact editing form with the current contact's data.
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

  // Saves the edited contact data and updates the UI.
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

  // Updates the contact's information in the UI after saving the edit.
function updateContactUI(contactsId, updatedContact, letter) {
  let nameInputIdOne = document.getElementById(`contact_name_one_${contactsId}`);
  let emailInputId = document.getElementById(`contact_email_${contactsId}`);
  let telInputId = document.getElementById(`contact_tel_${contactsId}`);
  if (nameInputIdOne) nameInputIdOne.textContent = updatedContact.name;
  if (emailInputId) emailInputId.textContent = updatedContact.email;
  if (telInputId) telInputId.textContent = updatedContact.number;
  getUsersList()
}

  // Returns the initials of the contact's name.
function getInitials(name) {
  let nameParts = name.trim().split(" ");
  let initials = nameParts[0].charAt(0).toUpperCase();
  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  return initials;
}

  // Disables the save button if required fields are not filled.
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

  // Returns the updated contact data.
function getUpdatedContact(existingUser) {
  let color = existingUser?.color ?? (globalIndex % contactColorArray.length);
  return {
    "name": document.getElementById('name_input').value.trim(),
    "email": document.getElementById('email_input').value.trim(),
    "number": document.getElementById('tel_input').value.trim(),
    "color": color
  };
}

  // Updates the contact picture based on the contact's initials and color.
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

  // Resets the contact picture to its original state.
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

  // Opens the contact detail modal.
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

  // Closes the contact detail modal.
function closeContactBig(event = null) {
  let backgroundDiv = document.getElementById('background_card');
  if (event) {
    if (event.target.id !== 'background_card') return;
  }
  backgroundDiv.style.display = 'none';
  backgroundDiv.classList.remove('card_contact_background');
  document.getElementById('content-card-big').style.display = 'none';
}

  // Updates the cancel button text and action based on whether the fields are filled or not.
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

  // Validates the name, phone, and email inputs.
function validateInputs(email) {
  return validateName() && validateTelInput() && validateEmailSync(email);
}

  // Validates the email input, ensuring it's not empty and unique.
function validateName() {
  let nameInput = document.getElementById('name_input');
  const isValid = nameInput.value.trim() !== "";
  document.getElementById('name_error').textContent = isValid ? "" : "Please enter a name!";
  nameInput.classList.toggle("input-error", !isValid);
  return isValid;
}

  // Validates the email input, ensuring it's not empty and unique.
function validateEmailSync(email) {
  let emailInput = document.getElementById('email_input');
  if (email.trim() === "") {
    showError(emailInput, "Plese enter a email!");
    return false;
  }
  let firstLetter = email.charAt(0).toUpperCase();
  if (!/^[A-Z]$/.test(firstLetter)) firstLetter = "#";
  let group = contactsData[firstLetter] || {};
  let exists = Object.values(group).some(c => c.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    showError(emailInput, "This email already exists!");
    return false;
  }
  clearError(emailInput);
  return true;
}

  // Validates the phone number input.
function validateTelInput() {
  const input = document.getElementById("tel_input");
  const error = document.getElementById("tel_error");
  const value = input.value.trim();
  const isValid = value !== "" && /^[0-9]+$/.test(value);
  error.textContent = isValid ? "" : (value === "" ? "Please enter a phone number!" : "Only numbers are allowed!");
  input.classList.toggle("input-error", !isValid);
  return isValid;
}

  // Displays an error message and highlights the input element with an error class.
function showError(inputElement, message) {
  let errorElement = document.getElementById('email_error');
  errorElement.textContent = message;
  inputElement.classList.add("input-error");
}

  // Clears the error message and removes the error highlight from the input element.
  function clearError(inputElement) {
  let errorElement = document.getElementById('email_error');
  errorElement.textContent = "";
  inputElement.classList.remove("input-error");
}

  // Clears all input errors for name, email, and phone number fields.
 function clearAllErrors() {
  ['name_input', 'email_input', 'tel_input'].forEach(id => clearError(document.getElementById(id)));
}

  // Closes the contact detail modal without saving any changes.
function cancelStatus() {
  document.getElementById('content-card-big').style.display = 'none';;

}

  // Resets the input fields to be empty and restores the cancel button's original functionality.
function deleteData() {
  let cancelButton = document.getElementById('cancel-button');
  document.getElementById('email_input').value = "";
  document.getElementById('name_input').value = "";
  document.getElementById('tel_input').value = "";
  cancelButton.innerText = "Cancel";
  cancelButton.setAttribute("onclick", "cancelStatus()");
}

  // Displays a success alert and reloads the user list after an action (like saving).
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
