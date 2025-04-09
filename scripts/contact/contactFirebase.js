const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/"
const colorIndexKey = "globalIndex";
let globalIndex = parseInt(localStorage.getItem(colorIndexKey)) || 0;


function saveGlobalIndex() {
    localStorage.setItem(colorIndexKey, globalIndex);
}

// Function to send data to the server using the PUT method.
async function postData(path = "", data = {}) {
    let response = await fetch(Base_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

// Function to get data from the server using the GET method.
async function getData(path = "") {
    let response = await fetch(`${Base_URL}${path}.json`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    return await response.json();
}

// Function to collect the new contact data from input fields.
function collectContactData() {
    let color = globalIndex % contactColorArray.length;
    let newContact = {
        "name": document.getElementById('name_input').value,
        "email": document.getElementById('email_input').value,
        "number": document.getElementById('tel_input').value,
        "color": color
    };
    globalIndex++;
    saveGlobalIndex();
    return newContact;
}

// Function to add a new contact to the data and send it to the server.
async function addContact() {
    let newContact = collectContactData();
    const email = document.getElementById('email_input').value;
    if (!validateInputs(email)) return;    let firstLetter = getFirstLetter(newContact.name);
    let contactsGroup = contactsData[firstLetter] || {};
    let newId = Object.keys(contactsGroup).length;
    contactsGroup[newId] = newContact;
    await postData(`/contacts/${firstLetter}`, contactsGroup);
    clearInputsAndClose();
    index = newId;
    let contactsId = `${firstLetter}-${newId}`;
     getUsersList();
     openContactBigMiddle(contactsId);
     showAlertSuccess(firstLetter, index); 
}

// Function to get the list of contacts from the server and update the UI.
async function getUsersList() {
    let userContainer = document.getElementById("user-list");
    userContainer.innerHTML = "";
    contactsData = await getData("/contacts");
    generateFullContactList(contactsData, userContainer);
    showHelpIconMobile();

}

// Function to generate the full list of contacts by sorting and displaying them.
function generateFullContactList(contacts, userContainer) {
    let sortedLetters = Object.keys(contacts).sort();
    sortedLetters.forEach(letter => generateContactList(contacts[letter], userContainer, letter));
}

// Function to clear all input fields and close the contact form.
function clearInputsAndClose() {
    ["name_input", "email_input", "tel_input"].forEach(id => document.getElementById(id).value = "");
    closeContactBig();
    resetPicture()
}

// Function to get the first letter of a name and return it in uppercase.
function getFirstLetter(name) {
    let letter = name.trim().charAt(0).toUpperCase();
    return /^[A-Z]$/.test(letter) ? letter : "#";
}

// Function to generate and display a list of contacts grouped by their first letter.
function generateContactList(contacts, userContainer, letter) {
    let currentLetter = "";
    Object.values(contacts).forEach((user, index) => {
        let firstLetter = user.name.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            userContainer.innerHTML += `
                <div class="contact-section">
                    <h3 class="contact-section_left">${currentLetter}</h3>
                    <hr class="contact-divider">
                </div>
            `;
        }
        let contactsId = `${firstLetter}-${index}`;
        let contactsIdColor = `${firstLetter}-${user.name.toLowerCase()}`;
        let color = getUserColor(contactsIdColor, letter);
        userContainer.innerHTML += contactCardScrollList(user, contactsId, color, letter);
    });
}

// Delete data for List
async function deleteContact(contactsId, firstLetter) {
    try {
      if (!contactsData?.[firstLetter]?.[contactsId]) return console.error("Kontakt nicht gefunden.");
      delete contactsData[firstLetter][contactsId];
      let updated = {}, i = 0;
      for (let id in contactsData[firstLetter]) updated[i++] = contactsData[firstLetter][id];
      await postData(`/contacts/${firstLetter}`, updated);
      globalIndex = i; saveGlobalIndex();
      setTimeout(() => location.reload(), 100);
      closeContactBigMiddle();
    } catch (e) { console.error("Fehler beim Löschen des Kontakts:", e); }
  }

 