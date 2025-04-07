let contactsData = [];
let oldPictureHTML = "";
let activeContact = null;
let allEmpty = true;


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


function getContactElement() {
  let contactMiddle = document.getElementById("contact-big-middle");
  if (!contactMiddle) console.error("Element mit ID 'contact-big-middle' nicht gefunden.");
  return contactMiddle;
}


function parseContactId(contactsId) {
  let [firstLetter, contactIndex] = contactsId.split("-");
  return { firstLetter, contactIndex };
}


async function fetchUser(firstLetter, contactIndex) {
  try {
    let contactsGroup = await getData(`/contacts/${firstLetter}`);
    return contactsGroup?.[contactIndex] || null;
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    return null;
  }
}


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


function hashCode(str) {
  return str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}


function renderContact(contactMiddle, user, contactIndex, firstLetter, color) {
  contactMiddle.innerHTML = contactCardMiddle(user, contactIndex, firstLetter, color);
}


function closeContactBigMiddle() {
  let contactMiddle = document.getElementById("contact-big-middle");
  if (contactMiddle) {
    contactMiddle.style.display = "none";
  }
}


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


function updateContactUI(contactsId, updatedContact, letter) {
  let nameInputIdOne = document.getElementById(`contact_name_one_${contactsId}`);
  let emailInputId = document.getElementById(`contact_email_${contactsId}`);
  let telInputId = document.getElementById(`contact_tel_${contactsId}`);
  if (nameInputIdOne) nameInputIdOne.textContent = updatedContact.name;
  if (emailInputId) emailInputId.textContent = updatedContact.email;
  if (telInputId) telInputId.textContent = updatedContact.number;
  getUsersList()
}


function getInitials(name) {
  let nameParts = name.trim().split(" ");
  let initials = nameParts[0].charAt(0).toUpperCase();
  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  return initials;
}


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


function getUpdatedContact(existingUser) {
  let color = existingUser?.color ?? (globalIndex % contactColorArray.length);
  return {
    "name": document.getElementById('name_input').value.trim(),
    "email": document.getElementById('email_input').value.trim(),
    "number": document.getElementById('tel_input').value.trim(),
    "color": color
  };
}


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


function openContactBig() {
  document.getElementById('content-card-big').style.display = 'flex';
  if (window.innerWidth <= 1000) {
    document.querySelector('.card_contact').classList.add('show');
  }
  contactcardHeadline();
}


function closeContactBig() {
  document.getElementById('content-card-big').style.display = 'none';
}


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

function validateInputs(email) {
  return validateName() && validateTelInput() && validateEmailSync(email);
}

function validateName() {
  let nameInput = document.getElementById('name_input');
  const isValid = nameInput.value.trim() !== "";
  document.getElementById('name_error').textContent = isValid ? "" : "Bitte einen Namen eingeben!";
  nameInput.classList.toggle("input-error", !isValid);
  return isValid;
}

function validateEmailSync(email) {
  let emailInput = document.getElementById('email_input');
  if (email.trim() === "") {
    showError(emailInput, "Bitte eine E-Mail eingeben!");
    return false;
  }
  let firstLetter = email.charAt(0).toUpperCase();
  if (!/^[A-Z]$/.test(firstLetter)) firstLetter = "#";
  let group = contactsData[firstLetter] || {};
  let exists = Object.values(group).some(c => c.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    showError(emailInput, "Diese E-Mail existiert bereits!");
    return false;
  }
  clearError(emailInput);
  return true;
}

function validateTelInput() {
  const input = document.getElementById("tel_input");
  const error = document.getElementById("tel_error");
  const value = input.value.trim();
  const isValid = value !== "" && /^[0-9]+$/.test(value);
  error.textContent = isValid ? "" : (value === "" ? "Bitte eine Telefonnummer eingeben!" : "Nur Zahlen sind erlaubt!");
  input.classList.toggle("input-error", !isValid);
  return isValid;
}

function showError(inputElement, message) {
  let errorElement = document.getElementById('email_error');
  errorElement.textContent = message;
  inputElement.classList.add("input-error");
}


function clearError(inputElement) {
  let errorElement = document.getElementById('email_error');
  errorElement.textContent = "";
  inputElement.classList.remove("input-error");
}

function clearAllErrors() {
  ['name_input', 'email_input', 'tel_input'].forEach(id => clearError(document.getElementById(id)));
}


function cancelStatus() {
  document.getElementById('content-card-big').style.display = 'none';;

}


function deleteData() {
  let cancelButton = document.getElementById('cancel-button');
  document.getElementById('email_input').value = "";
  document.getElementById('name_input').value = "";
  document.getElementById('tel_input').value = "";
  cancelButton.innerText = "Cancel";
  cancelButton.setAttribute("onclick", "cancelStatus()");
}


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