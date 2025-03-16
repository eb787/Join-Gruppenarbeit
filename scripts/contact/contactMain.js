
let contactsData = [];
let oldPictureHTML = "";
console.log(contactsData);

async function openContactBigMiddle(contactsId) {
  let contactMiddle = getContactElement();
  if (!contactMiddle) return;

  let { firstLetter, contactIndex } = parseContactId(contactsId);
  let user = await fetchUser(firstLetter, contactIndex);

  if (user) {
    let color = getUserColor(user, contactIndex);
    renderContact(contactMiddle, user, contactIndex, firstLetter, color);
  } else {
    console.error("Kein Benutzer gefunden mit ID:", contactsId);
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

async function editContact(contactsId, firstLetter,color) {
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
  let updatedContact = {
    "name": document.getElementById('name_input').value,
    "email": document.getElementById('email_input').value,
    "number": document.getElementById('tel_input').value
  };
  await postData(`/contacts/${firstLetter}/${contactsId}`, updatedContact);
  closeContactBig()
  closeContactBigMiddle()
  updateUserList();
  resetPicture();
  validateName();
  validateEmail();

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
  if (emailInput.value.trim() === "") {
    document.getElementById('email_error').textContent = "Bitte eine E-Mail eingeben!";
    emailInput.classList.add("input-error");
    return false;
  }

  if (!/^[A-Z]$/.test(firstLetter)) firstLetter = "#";
  let contactsGroup = contactsData[firstLetter] || {};
console.log(contactsGroup);

  if (Object.values(contactsGroup).some(contact => contact.email === email)) {
    document.getElementById('email_error').textContent = "Diese E-Mail existiert bereits!";
    emailInput.classList.add("input-error");
    return false;
  }

  return true;
}async function validateEmail(email) {
  let firstLetter = email.trim().charAt(0).toUpperCase();
  if (emailInput.value.trim() === "") {
    showError(emailInput, "Bitte eine E-Mail eingeben!");
    return false;
  }
  if (!/^[A-Z]$/.test(firstLetter)) firstLetter = "#";
  let contactsGroup = contactsData[firstLetter] || {};
  let emailExists = Object.values(contactsGroup).some(contact => contact.email.toLowerCase() === email.toLowerCase());

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