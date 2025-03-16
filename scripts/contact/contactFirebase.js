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

    if (!validateName(nameInput) || !(await validateEmail(newContact.email))) return;

    let firstLetter = getFirstLetter(newContact.name);
    let contactsGroup = contactsData[firstLetter] || {};
    let newId = Object.keys(contactsGroup).length;
    contactsGroup[newId] = newContact;

    await postData(`/contacts/${firstLetter}`, contactsGroup);
    clearInputsAndClose();
    getUsersList();
}

async function getUsersList() {
    let userContainer = document.getElementById("user-list");
    userContainer.innerHTML = "";
    contactsData = await getData("/contacts");
    generateFullContactList(contactsData, userContainer);

}

async function updateUserList() {
    console.log("🔄 updateUserList() gestartet...");

    let userContainer = document.getElementById("user-list");
    if (!userContainer) {
        console.error("❌ Element 'user-list' nicht gefunden.");
        return;
    }

    console.log("📡 Hole aktuelle Kontaktdaten...");
    let contactsData = await getData("/contacts");

    let tempContainer = document.createElement("div"); // Temporärer Container für neue Liste
    generateFullContactList(contactsData, tempContainer);

    console.log(`✅ Neue Liste generiert mit ${tempContainer.children.length} Elementen.`);

    userContainer.replaceChildren(...tempContainer.children); // Aktualisiert Liste effizient

    console.log("♻️ Kontakte ersetzt, rufe restoreClickEvents() auf...");
    restoreClickEvents(); // Stellt sicher, dass die Kontakte wieder anklickbar sind

    console.log("✅ updateUserList() abgeschlossen.");
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
                <div class="contact-section" id= "contact-section">
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
        let contactElement = document.getElementById(`contact-card-${firstLetter}-${contactId}`);
        if (contactElement) {
            contactElement.remove();
        }
        let remainingContacts = document.querySelectorAll(`[data-letter="${firstLetter}"] .contact-card`);

        let contactSection = document.getElementById(`contact-section-${firstLetter}`);
        if (contactSection && remainingContacts.length === 0) {
            contactSection.remove();
        }

        // 4️⃣ UI neu synchronisieren, ohne die EventListener zu verlieren
        updateUserList(); 

        // 5️⃣ Schließe das Kontakt-Detail-Fenster
        closeContactBigMiddle();
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
    }
}

function restoreClickEvents() {
    let userContainer = document.getElementById("user-list");

    if (!userContainer) {
        console.error("❌ restoreClickEvents: 'user-list' nicht gefunden.");
        return;
    }

    console.log("🛠 Entferne alte EventListener...");
    userContainer.replaceWith(userContainer.cloneNode(true)); // Alte EventListener entfernen
    userContainer = document.getElementById("user-list"); // Neu holen nach replace

    console.log("🔗 Setze neuen EventListener...");
    userContainer.addEventListener("click", function(event) {
        let target = event.target.closest(".user-list");

        if (!target) {
            console.log("❌ Kein gültiger Kontakt angeklickt.");
            return;
        }

        let contactId = target.dataset.id;
        let firstLetter = target.dataset.letter;

        console.log(`✅ Kontakt angeklickt: ${firstLetter}-${contactId}`);

        if (contactId && firstLetter) {
            openContactBigMiddle(`${firstLetter}-${contactId}`);
        }
    });

    console.log("✅ restoreClickEvents() abgeschlossen.");
}
