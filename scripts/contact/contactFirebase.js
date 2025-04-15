/** 
 * Base URL for Firebase Realtime Database.
 * @constant {string}
 */
const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Key for storing global index in localStorage.
 * @constant {string}
 */
const colorIndexKey = "globalIndex";

/**
 * Global index for assigning colors to contacts.
 * @type {number}
 */
let globalIndex = parseInt(localStorage.getItem(colorIndexKey)) || 0;

/**
 * Saves the global index to localStorage.
 */
function saveGlobalIndex() {
    localStorage.setItem(colorIndexKey, globalIndex);
}

/**
 * Sends data to the server using the PUT method.
 * @async
 * @param {string} path - The path in the database.
 * @param {Object} data - The data to be sent.
 * @returns {Promise<Object>} - The response from the server.
 */
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

/**
 * Retrieves data from the server using the GET method.
 * @async
 * @param {string} path - The path in the database.
 * @returns {Promise<Object>} - The data retrieved from the server.
 */
async function getData(path = "") {
    let response = await fetch(`${Base_URL}${path}.json`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    return await response.json();
}

/**
 * Collects the new contact data from the input fields.
 * @returns {Object} - The new contact object with name, email, number, and color.
 */
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

/**
 * Adds a new contact to the database and updates the UI.
 * @async
 */
async function addContact() {
    let newContact = collectContactData();
    const email = document.getElementById('email_input').value;
    if (!validateInputs(email)) return;

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



/**
 * Retrieves the list of contacts from the server and updates the UI.
 * @async
 */
async function getUsersList() {
    let userContainer = document.getElementById("user-list");
    userContainer.innerHTML = "";
    contactsData = await getData("/contacts");
    generateFullContactList(contactsData, userContainer);
    showHelpIconMobile();
}

/**
 * Generates the full list of contacts, sorted by their first letter.
 * @param {Object} contacts - The contacts data to generate the list from.
 * @param {HTMLElement} userContainer - The container element where the list will be displayed.
 */
function generateFullContactList(contacts, userContainer) {
    let sortedLetters = Object.keys(contacts).sort();
    sortedLetters.forEach(letter => generateContactList(contacts[letter], userContainer, letter));
}

/**
 * Clears the input fields and closes the contact form.
 */
function clearInputsAndClose() {
    ["name_input", "email_input", "tel_input"].forEach(id => document.getElementById(id).value = "");
    closeContactBig();
    resetPicture();
    clearAllErrors()
}

/**
 * Gets the first letter of a name and returns it in uppercase.
 * @param {string} name - The name to extract the first letter from.
 * @returns {string} - The first letter of the name, or "#" if it's not a letter.
 */
function getFirstLetter(name) {
    let letter = name.trim().charAt(0).toUpperCase();
    return /^[A-Z]$/.test(letter) ? letter : "#";
}

/**
 * Generates and displays a list of contacts, grouped by their first letter.
 * @param {Object} contacts - The contacts data to generate the list from.
 * @param {HTMLElement} userContainer - The container element where the list will be displayed.
 * @param {string} letter - The first letter for the current group of contacts.
 */
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

/**
 * Deletes a contact from the database and updates with getUsersList
 * @async
 * @param {string} contactsId - The ID of the contact to delete.
 * @param {string} firstLetter - The first letter of the contact's name, used to find the correct group.
 */
async function deleteContact(contactsId, firstLetter) {
    try {
        if (!contactsData?.[firstLetter]?.[contactsId]) return console.error("Kontakt nicht gefunden.");
        delete contactsData[firstLetter][contactsId];
        let updated = {}, i = 0;
        for (let id in contactsData[firstLetter]) updated[i++] = contactsData[firstLetter][id];
        await postData(`/contacts/${firstLetter}`, updated);
        globalIndex = i; saveGlobalIndex();
        getUsersList();
        closeContactBigMiddle();
    } catch (e) { console.error("Fehler beim Löschen des Kontakts:", e); }
}
