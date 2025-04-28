let contactsData = [];
let oldPictureHTML = "";
let activeContact = null;
let allEmpty = true;
let originalEmail = "";


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
  editContactMobile();
  contactcardHeadlineEdit();
  let contact = await getData(`/contacts/${firstLetter}/${contactsId}`);
  if (contact) {
    originalEmail = contact.email;
    document.getElementById('name_input').value = contact.name;
    document.getElementById('email_input').value = contact.email;
    document.getElementById('tel_input').value = contact.number;
    let saveButton = document.getElementById('save-button');
    updatePicture(contact, color);
    disabledButton();
    saveButton.onclick = async function () {
      await saveEditedContact(contactsId, firstLetter, color);
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
  let index = parseInt(localStorage.getItem(`${contactsId}_index`)) || 0;
  saveGlobalIndex();
  let existingUser = await fetchUser(firstLetter, index);
  let updatedContact = getUpdatedContact(existingUser);
  let newLetter = updatedContact.name.charAt(0).toUpperCase();
  if (newLetter !== firstLetter) {
    await handleContactMove(firstLetter, newLetter, contactsId, updatedContact);
  } else {
    await handleContactUpdate(firstLetter, contactsId, updatedContact);
  }
  clearInputsAndClose();
  closeEditMobile();
}


/**
 * Handles the update of a contact within the same letter group.
 * Sends the updated contact data to the backend, updates localStorage,
 * and refreshes the UI with the new data.
 *
 * @param {string} letter - The first letter of the contact's name.
 * @param {string} id - The contact's ID within its group.
 * @param {Object} contact - The updated contact data.
 */
async function handleContactUpdate(letter, id, contact) {
  await postData(`/contacts/${letter}/${id}`, contact);
  localStorage.setItem(`contactColor_${letter}_${id}`, contact.color);
  updateContactUI(id, contact, letter);
  openContactBigMiddle(`${letter}-${id}`, letter);
  closeContactBig();
}


/**
 * Handles moving a contact to a different letter group (e.g., due to name change).
 * Recalculates contact IDs, updates localStorage, and refreshes the UI.
 * @param {string} oldLetter - The original letter group.
 * @param {string} newLetter - The new letter group.
 * @param {string} oldId - The contact's original ID.
 * @param {Object} contact - The updated contact data.
 */
async function handleContactMove(oldLetter, newLetter, oldId, contact) {
  await recalculateContactIds(oldLetter, newLetter, oldId, contact);
  let newSection = contactsData[newLetter];
  let newId = Object.keys(newSection).find(id => newSection[id].email === contact.email);
  if (!newId) return;
  localStorage.setItem(`${newId}_index`, newId);
  updateContactUI(newId, contact, newLetter);
  openContactBigMiddle(`${newLetter}-${newId}`, newLetter);
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
 * Recalculates contact IDs when a contact is moved to a different letter group.
 * Deletes the contact from the old group and adds it to the new group,
 * then reorders both groups to ensure sequential IDs.
 * Updates the backend and local data structures accordingly.
 *
 * @param {string} oldLetter - The original first letter of the contact's name.
 * @param {string} newLetter - The new first letter after the name has changed.
 * @param {string} contactsId - The original contact ID.
 * @param {Object} updatedContact - The updated contact data.
 */
async function recalculateContactIds(oldLetter, newLetter, contactsId, updatedContact) {
  try {
    let oldContacts = contactsData[oldLetter] || {};
    let newContacts = contactsData[newLetter] || {};
    if (oldContacts[contactsId]) delete oldContacts[contactsId];
    let newIndex = Object.keys(newContacts).length;
    newContacts[newIndex] = updatedContact;
    let reorderedOld = {}, i = 0;
    for (let id in oldContacts) {
      reorderedOld[i++] = oldContacts[id];
    }
    let reorderedNew = {}, j = 0;
    for (let id in newContacts) {
      reorderedNew[j++] = newContacts[id];
    }
    await postData(`/contacts/${oldLetter}`, reorderedOld);
    await postData(`/contacts/${newLetter}`, reorderedNew);
    contactsData[oldLetter] = reorderedOld;
    contactsData[newLetter] = reorderedNew;
    globalIndex = Math.max(i, j);
    saveGlobalIndex();
    getUsersList();
  } catch (err) {
    console.error("Error while recalculating contact IDs:", err);
  }
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