const contactColorArray = {
    1: "#1FD7C1",
    2: "#462F8A",
    3: "#FC71FF",
    4: "#6E52FF",
    5: "#9327FF",
    6: "#FFBB2B",
    7: "#FF4646",
    8: "#00BEE8",
    9: "#FF7A00"
};

const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

let currentPersons = []; 

function onloadFunc() {
    loadAllPersons(); 
}

async function getData(path) {
    try {
        const response = await fetch(Base_URL + path + ".json");
        if (!response.ok) throw new Error("Netzwerkfehler");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

async function loadAllPersons() {
    let personsData = await getData("/contacts");
    if (personsData) {
        currentPersons = Object.entries(personsData).map(([id, person]) => ({ id, ...person }));
        console.log("Alle Personen mit IDs:", currentPersons);

        for (let i = 0; i < currentPersons.length; i++) {
            console.log(`Person ${i + 1} mit ID ${currentPersons[i].id}:`, currentPersons[i]);
        }
    } else {
        console.log("Keine Personendaten gefunden");
    }
}

async function addContact() {
    let { email, name, number } = getUserInput();
    let newID = await getNextID();
    let color = contactColorArray[newID] || "#FFFFFF"; 
    await saveContact(newID, email, name, number, color);
}

function getUserInput() {
    let name = document.getElementById('name_input').value;
    let email = document.getElementById('email_input').value;
    let number = document.getElementById('tel_input').value;
    return {   
        "name": name,
        "email": email,
        "number": number
    };
}

async function getNextID() {
    let data = await getData("/contacts");
    let nextID = data ? Math.max(...Object.keys(data).map(id => parseInt(id))) + 1 : 1;

    console.log("Nächste ID: ", nextID);
    return nextID;
}

async function saveContact(personID, email, name, phone, color) {
    let personData = { email, name, phone, color };
    let url = `${Base_URL}/contacts/${personID}.json`;  

    try {
        const response = await fetch(url, {
            method: "PUT",  
            headers: {  
                "Content-Type": "application/json"
            },
            body: JSON.stringify(personData)
        });

        if (!response.ok) throw new Error("Fehler beim Speichern des Kontakts");

        let data = await response.json();
        console.log("Kontakt gespeichert:", data);
    } catch (error) {
        console.error("Fehler beim Speichern des Kontakts:", error);
    }
}
