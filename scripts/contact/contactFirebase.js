const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/"
const colorIndexKey = "globalIndex"; // Schlüssel für LocalStorage

let globalIndex = parseInt(localStorage.getItem(colorIndexKey)) || 0;
function saveGlobalIndex() {
    localStorage.setItem(colorIndexKey, globalIndex);
}

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


window.onload = getUsersList;

async function addContact() {
    let newContact = collectContactData();
    let nameInput = document.getElementById('name_input');
    let emailInput = document.getElementById('email_input');

    if (!validateName(nameInput) || !(await validateEmail(emailInput, newContact.email))) return;

    let firstLetter = getFirstLetter(newContact.name);
    let contactsGroup = contactsData[firstLetter] || {};
    let newId = Object.keys(contactsGroup).length;
    contactsGroup[newId] = newContact;
   
    await postData(`/contacts/${firstLetter}`, contactsGroup);
    clearInputsAndClose();
    getUsersList(); // Aktualisiert die gesamte Liste
}

async function getUsersList() {
    let userContainer = document.getElementById("user-list");
    userContainer.innerHTML = "";
    contactsData = await getData("/contacts");
    generateFullContactList(contactsData, userContainer);

    addEventListenersToContacts(); // Füge Event Listener neu hinzu
}

function addEventListenersToContacts() {
    document.querySelectorAll(".contact-card").forEach(contact => {
        contact.addEventListener("click", function () {
            let contactId = this.dataset.id;
            openContactBigMiddle(contactId);
        });
    });
}

async function getData(path = "") {
    let response = await fetch(`${Base_URL}${path}.json`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    return await response.json();
}

function generateFullContactList(contacts, userContainer) {
    let sortedLetters = Object.keys(contacts).sort();
    sortedLetters.forEach(letter => generateContactList(contacts[letter], userContainer, letter));
}

function clearInputsAndClose() {
    ["name_input", "email_input", "tel_input"].forEach(id => document.getElementById(id).value = "");
    closeContactBig();
    resetPicture()
    
}

function getFirstLetter(name) {
    let letter = name.trim().charAt(0).toUpperCase();
    return /^[A-Z]$/.test(letter) ? letter : "#";
}

function generateContactList(contacts, userContainer, letter) {
    let currentLetter = "";

    Object.values(contacts).forEach((user, index) => {
        let firstLetter = user.name.charAt(0).toUpperCase();

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            userContainer.innerHTML += `
                <div class="contact-section">
                    <h3 class="contact-section-title">${currentLetter}</h3>
                    <hr class="contact-divider">
                </div>
            `;
        }
        let colorIndex = typeof user.color === "number" 
            ? user.color % contactColorArray.length 
            : index % contactColorArray.length;

        let color = contactColorArray[colorIndex];


        let contactId = `${currentLetter}-${index}`;
        userContainer.innerHTML += contactCardScrollList(user, contactId, color);
    });
}

function contactColorAssign(color) {
    return contactColorArray[color - 1] || "#ccc"; 
}


// Delete data for List
async function deleteContact(contactId, firstLetter) {
    try {
        if (!contactsData || !contactsData[firstLetter] || !contactsData[firstLetter][contactId]) {
            console.error("Kontakt nicht gefunden.");
            return;
        }

        delete contactsData[firstLetter][contactId];

        let updatedContacts = {};
        let newId = 0;
        for (let oldId in contactsData[firstLetter]) {
            updatedContacts[newId] = contactsData[firstLetter][oldId];
            newId++;
        }

        await postData(`/contacts/${firstLetter}`, updatedContacts);
        globalIndex = newId;
        saveGlobalIndex();

        await getUsersList();

        setTimeout(() => {
            restoreClickEvents();
        }, 100); // Leichte Verzögerung, um sicherzustellen, dass DOM-Updates abgeschlossen sind

        closeContactBigMiddle();
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
    }
}

function restoreClickEvents() {
    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", function () {
            let contactId = this.dataset.id;
            let firstLetter = this.dataset.letter;
            deleteContact(contactId, firstLetter);
        });
    });

    document.querySelectorAll(".edit-button").forEach(button => {
        button.addEventListener("click", function () {
            let contactId = this.dataset.id;
            let firstLetter = this.dataset.letter;
            editContact(contactId, firstLetter);
        });
    });
}
