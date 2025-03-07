async function openContactBigMiddle(contactsId) {
  let contactMiddle = document.getElementById("contact-big-middle");
  if (!contactMiddle) {
      console.error("Element mit ID 'contact-big-middle' nicht gefunden.");
      return;
  }
  let firstLetter = contactsId.split("-")[0]; 
  let contactIndex = contactsId.split("-")[1];
  try {
      let contactsGroup = await getData(`/contacts/${firstLetter}`);
      
      if (contactsGroup && contactsGroup[contactIndex]) {
          let user = contactsGroup[contactIndex];
          contactMiddle.innerHTML = contactCardMiddle(user, contactIndex, firstLetter);
      } else {
          console.error("Kein Benutzer gefunden mit ID:", contactsId);
      }
  } catch (error) {
      console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
}

function closeContactBigMiddle() {
  let contactMiddle = document.getElementById("contact-big-middle");
  if (contactMiddle) {
      contactMiddle.style.display = "none";
  } 
}

async function editContact(contactsId, firstLetter) {
  let editContact = document.getElementById('content-card-big');
  editContact.style.display = 'flex';

  let contact = await getData(`/contacts/${firstLetter}/${contactsId}`);

  if (contact) {
      document.getElementById('name_input').value = contact.name;
      document.getElementById('email_input').value = contact.email;
      document.getElementById('tel_input').value = contact.number;
      let saveButton = document.getElementById('save-button');
      saveButton.onclick = async function () {
          await saveEditedContact(contactsId, firstLetter);
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
  document.getElementById('content-card-big').style.display = 'none';

}

function openContactBig() {
  document.getElementById('content-card-big').style.display = 'flex';
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