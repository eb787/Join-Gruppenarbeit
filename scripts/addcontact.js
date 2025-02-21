const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/"

function onloadFunc() {
   
}

async function postData(path = "", data = {}) {
    let response = await fetch(Base_URL + path + ".json", {
        method: "POST",
        headers: {  
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
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

function addContact() {
    let noteData = collectContactData(); 

    postData("/contact", noteData)
    .then(response => {
        console.log("Daten erfolgreich gespeichert", response);
    })
    .catch(error => {
        console.error("Fehler beim Speichern der Daten", error);
    });
}