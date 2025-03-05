const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

async function userLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.querySelector('.wrong_data_alert');
    
    resetErrorMessage(errorMessage);
    
    if (!email || !password) return showErrorMessage(errorMessage, "Please fill in all fields.");
    const userData = await checkIfContactExists(email);
    if (!userData) return showErrorMessage(errorMessage, "User not found.");
    if (userData.password !== password) return showErrorMessage(errorMessage, "Incorrect password. Please try again.");
    
    window.location.href = "../HTML/summary_guest.html"; 
}

async function checkIfContactExists(email) {
    const res = await fetch(`${Base_URL}/logindata.json`);
    const data = await res.json();
    return findUserByEmail(data, email);
}

function findUserByEmail(data, email) {
    for (let id in data) {
        if (data[id].email === email) return data[id];
    }
    return null;
}

function resetErrorMessage(errorMessage) {
    errorMessage.classList.remove("show");
}

function showErrorMessage(errorMessage, message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
}


