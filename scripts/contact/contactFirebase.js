const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/"
const colorIndexKey = "globalIndex";

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

    if (!validateName(nameInput) || !(await validateEmail(newContact.email))) return;

    let firstLetter = getFirstLetter(newContact.name);
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

async function getUsersList() {
    let userContainer = document.getElementById("user-list");
    userContainer.innerHTML = "";
    contactsData = await getData("/contacts");
    generateFullContactList(contactsData, userContainer);

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
        let contactsId = `${firstLetter}-${index}`;
        let contactsIdColor = `${firstLetter}-${user.name.toLowerCase()}`;
        let color = getUserColor(contactsIdColor, letter);

        userContainer.innerHTML += contactCardScrollList(user, contactsId, color, letter);
    });
}

// Delete data for List
async function deleteContact(contactsId, firstLetter) {
    try {
        if (!contactsData || !contactsData[firstLetter] || !contactsData[firstLetter][contactsId]) {
            console.error("Kontakt nicht gefunden.");
            return;
        }
        delete contactsData[firstLetter][contactsId];
        let updatedContacts = {};
        let newId = 0;
        for (let oldId in contactsData[firstLetter]) {
            updatedContacts[newId] = contactsData[firstLetter][oldId];
            newId++;
        }
        await postData(`/contacts/${firstLetter}`, updatedContacts);
        globalIndex = newId;
        saveGlobalIndex();
        let contactElement = document.getElementById(`contact-card-A-0`);
        if (contactElement) {
            contactElement.remove();
        }
        let remainingContacts = document.querySelectorAll(`[data-letter="${firstLetter}"] .contact-card`);

        let contactSection = document.getElementById(`contact-section-${firstLetter}`);
        if (contactSection && remainingContacts.length === 0) {
            contactSection.remove();
        }

        setTimeout(() => {
            location.reload();
        }, 100);

        closeContactBigMiddle();
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
    }
}


function deleteHtml() {
    let contactElement = document.getElementById(`contact-card-A-0`);
if (contactElement) {
    contactElement.remove();
}
}
 