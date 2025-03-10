const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/"
let userPromises = [];


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

    const color = contactColorArray[globalIndex % contactColorArray.length];
    console.log(color);

    return {
        "name": document.getElementById('name_input').value,
        "email": document.getElementById('email_input').value,
        "number": document.getElementById('tel_input').value,
        "color" : color
    };
   
  
}
async function addContact() {
    let newContact = collectContactData();
    let nameInput = document.getElementById('name_input');
    let emailInput = document.getElementById('email_input');
    if (!validateName(nameInput)) {
        return;
    }
    if (!validateEmail(emailInput, newContact.email)) {
        return;
    }
    let firstLetter = newContact.name.trim().charAt(0).toUpperCase();
    if (!/^[A-Z]$/.test(firstLetter)) firstLetter = "#";
    let contactsGroup = await getData(`/contacts/${firstLetter}`);
    if (!contactsGroup) contactsGroup = {};
    let newId = Object.keys(contactsGroup).length;
    contactsGroup[newId] = newContact;
    await postData(`/contacts/${firstLetter}`, contactsGroup);
    clearInputsAndClose();
    addContactToDOM(newContact, `${firstLetter}-${newId}`);

   
}


async function addContactToDOM(newContact, contactsId) {
    let userContainer = document.getElementById("user-list");
    let firstLetter = newContact.name.trim().charAt(0).toUpperCase();
    if (!/^[A-Z]$/.test(firstLetter)) firstLetter = "#";
    let contactsGroup = await getData(`/contacts/${firstLetter}`);
    userContainer.innerHTML += contactCardScrollList(newContact, contactsId);

    userContainer.innerHTML = "";
    generateContactList(contactsGroup, userContainer);
    getUsersList()
}


function clearInputsAndClose() {
    document.getElementById('name_input').value = "";
    document.getElementById('email_input').value = "";
    document.getElementById('tel_input').value = "";
    closeContactBig();
}

async function getData(path = "") {
    let response = await fetch(Base_URL + path + ".json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    return await response.json();
}

// Funktion, um die Benutzerliste zu laden
async function getUsersList() {
    let userContainer = document.getElementById("user-list");
    userContainer.innerHTML = "";
    let contacts = await getData("/contacts");

    if (contacts) {
        let sortedLetters = Object.keys(contacts).sort();
        let globalIndex = 0; 

        for (let letter of sortedLetters) {
            let contactsGroup = contacts[letter];
            generateContactList(contactsGroup, userContainer, letter, globalIndex);
            globalIndex += Object.keys(contactsGroup).length; // Erhöhe den globalen Index für jedes Kontakt-Array
        }
    }

}

window.onload = getUsersList;

function generateContactList(contacts, userContainer, letter, globalIndex) {
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
        user.color = contactColorArray[globalIndex % contactColorArray.length];
        globalIndex++;
        let contactId = `${currentLetter}-${index}`;
        userContainer.innerHTML += contactCardScrollList(user, contactId);
    });
}
// Delete data for List
async function deleteContact(contactId, firstLetter) {
    try {
        let contactsGroup = await getData(`/contacts/${firstLetter}`);

        if (!contactsGroup || !contactsGroup[contactId]) {
            console.error("Kontakt nicht gefunden.");
            return;
        }

        // Kontakt entfernen
        delete contactsGroup[contactId];

        // IDs neu von 0 aufwärts vergeben
        let updatedContacts = {};
        let newId = 0;

        for (let oldId in contactsGroup) {
            updatedContacts[newId] = contactsGroup[oldId];
            newId++;
        }
        await postData(`/contacts/${firstLetter}`, updatedContacts);

        await getUsersList();
        closeContactBigMiddle()
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
    }
}

