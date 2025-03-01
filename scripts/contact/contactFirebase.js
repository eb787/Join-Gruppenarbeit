const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/"
let allNames = {};
let allEmails = {};
let allNumbers = {};
let allContacts = {};


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
    let valuename = document.getElementById('name_input').value;
    let valueemail = document.getElementById('email_input').value;
    let valuetel = document.getElementById('tel_input').value;

    return {
        "name": valuename,
        "email": valueemail,
        "number": valuetel
    };
}

async function addContact() {
    let noteData = collectContactData();
    let contactsResponse = await fetch(Base_URL + "/contacts.json");
    let contactsResponseToJson = await contactsResponse.json();

    let taskId = contactsResponseToJson ? Object.keys(contactsResponseToJson).length : 0;

    await postData(`/contacts/${taskId}`, noteData)
        .then(response => {
            console.log("Daten erfolgreich gespeichert unter TaskID:", taskId, response);
            clearInputsAndClose();
            getUsersList;
        })
        .catch(error => {
            console.error("Fehler beim Speichern der Daten", error);
        });
}


function clearInputsAndClose() {
    document.getElementById('name_input').value = "";
    document.getElementById('email_input').value = "";
    document.getElementById('tel_input').value = "";
    closeContactBig();
}

// Get data for List KOntakte laden

async function getData(path = "") {
    let response = await fetch(Base_URL + path + ".json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    return await response.json();
}

async function getUsersList() {
    let userContainer = document.getElementById("user-list");
    userContainer.innerHTML = ""; // Inhalt vor dem Laden leeren

    for (let i = 0; i < 70; i++) {
        let user = await getData(`/contacts/${i}`);

        if (user) {
            userContainer.innerHTML += contactCardScrollList(user, i);
        }
    }
}

window.onload = getUsersList;


// Delete data for List

async function deleteContactInFirebase() {
    let response = await fetch(Base_URL + path + ".json", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

