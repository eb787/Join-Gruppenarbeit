
let contactsData = [];
let oldPictureHTML = "";
let activeContact = null;
console.log(contactsData);

async function openContactBigMiddle(contactsId) {
  let contactMiddle = getContactElement();
  if (!contactMiddle) return;

  let { firstLetter, contactIndex } = parseContactId(contactsId);
  let user = await fetchUser(firstLetter, contactIndex);

  if (user) {
    let color = getUserColor(user, contactIndex);
    renderContact(contactMiddle, user, contactIndex, firstLetter, color);

    highlightActiveContact(contactsId, firstLetter);
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

function getUserColor(user, index) {
  return contactColorArray[
    typeof user.color === "number" ? user.color % contactColorArray.length : index % contactColorArray.length
  ];
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
  let editContact = document.getElementById('content-card-big');
  editContact.style.display = 'flex';
  contactcardHeadlineEdit()
  let contact = await getData(`/contacts/${firstLetter}/${contactsId}`);
  if (contact) {
    document.getElementById('name_input').value = contact.name;
    document.getElementById('email_input').value = contact.email;
    document.getElementById('tel_input').value = contact.number;
    let saveButton = document.getElementById('save-button');
    updatePicture(contact, color)
    saveButton.onclick = async function () {
      await saveEditedContact(contactsId, firstLetter, color);
    };
  }

}

async function saveEditedContact(contactsId, firstLetter) {
  let contactIndex = parseInt(localStorage.getItem(`${contactsId}_index`)) || 0;
  saveGlobalIndex() 
 
  let color = contactColorArray[contactIndex % contactColorArray.length]; // Farbe bleibt stabil

  let updatedContact = {
    "name": document.getElementById('name_input').value.trim(),
    "email": document.getElementById('email_input').value.trim(),
    "number": document.getElementById('tel_input').value.trim(),
    "color": color // Nutzt gespeicherten Index für konsistente Farbe
  };

  await postData(`/contacts/${firstLetter}/${contactsId}`, updatedContact);

  closeContactBig();
  closeContactBigMiddle();
  resetPicture();
  validateName();
  validateEmail(updatedContact.email);
  location.reload();

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
  let backgroundColor = color || "#ccc";

  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  contactPicture.innerHTML = `
  
      <h4 class="contact_abbreviation_big" style="background-color:${backgroundColor};">${initials}</h4>
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
  contactcardHeadline();
}


function closeContactBig() {
  document.getElementById('content-card-big').style.display = 'none';;
}

function closeContactBigMiddle() {
  document.getElementById('contact-big-middle').style.display = 'none';;
}

function updateCancelButton() {
  let inputs = document.querySelectorAll('#name_input, #email_input, #tel_input');
  let cancelButton = document.getElementById('cancel-button');
  let allEmpty = true;
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


function validateName() {
  let nameInput = document.getElementById('name_input');
  if (nameInput.value.trim() === "") {
    document.getElementById('name_error').textContent = "Bitte einen Namen eingeben!";
    nameInput.classList.add("input-error");
    return false;
  } else {
    document.getElementById('name_error').textContent = "";
    nameInput.classList.remove("input-error");
    return true;
  }
}


// Funktion zur E-Mail-Validierung
async function validateEmail(email) {
  let emailInput = document.getElementById('email_input');
  let firstLetter = email.trim().charAt(0).toUpperCase();

  if (!emailInput) {
    console.error("Element mit ID 'email_input' nicht gefunden.");
    return false;
  }

  if (email.trim() === "") {
    showError(emailInput, "Bitte eine E-Mail eingeben!");
    return false;
  }

  if (!/^[A-Z]$/.test(firstLetter)) {
    firstLetter = "#";
  }

  let contactsGroup = contactsData[firstLetter] || {};
  let emailExists = Object.values(contactsGroup).some(
    contact => contact.email.toLowerCase() === email.toLowerCase()
  );

  if (emailExists) {
    showError(emailInput, "Diese E-Mail existiert bereits!");
    return false;
  }

  clearError(emailInput);
  return true;
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
  let mainDiv = document.getElementById('contact_card');
  mainDiv.innerHTML += alertSuccess();  // Fügt das Alert hinzu

  let alert = document.getElementById('alert'); // Holt das Alert-Element

  // Timeout, um das Alert nach 1,5 Sekunden zu entfernen
  setTimeout(() => {
    if (alert) {
      alert.remove();  // Entfernt nur das Alert-Element, der Rest der Seite bleibt interaktiv
    }
  }, 1000);

  // Benutzerliste aktualisieren
  await getUsersList();



  let contactsId = `${currentLetter}-${index}`;
  openContactBigMiddle(contactsId);
}