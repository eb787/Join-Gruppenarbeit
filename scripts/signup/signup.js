const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

function enableSubmitButton() {
    document.getElementById('signup_btn').disabled = true;
    const inputs = document.querySelectorAll('#name, #email, #password, #confirm_password, #privacy_checkbox');
    inputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
    });
}

function checkFormValidity() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const checkbox = document.getElementById('privacy_checkbox').checked;

    if (name && email && password && confirmPassword && password === confirmPassword && checkbox) {
        document.getElementById('signup_btn').disabled = false;
    } else {
        document.getElementById('signup_btn').disabled = true;
    }
}

async function addUserSignUp() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm_password').value;
    let checkbox = document.getElementById('privacy_checkbox').checked;

    if (!checkInput(name, email, password, confirmPassword, checkbox)) return;
    if (await checkIfContactExists(email)) {
        showErrorMessage("A contact with this email address already exists.");
        return;
    } 
    await saveContact(email, name, password);
    document.getElementById('successful_signin_btn').style.display = 'flex';
    resetFormFields();
}


function checkInput(name, email, password, confirmPassword, checkbox) {
    if (!name || !email || !password || !confirmPassword) {
        showErrorMessage("Please fill in all fields.");
        return false;
    }
    if (!email.includes("@")) {
        showErrorMessage("Please enter a valid email address.");
        return false;
    }
    if (password.length < 4) {
        showErrorMessage("Password must be at least 4 characters long.");
        return false;
    }
    if (password !== confirmPassword) {
        showErrorMessage("Passwords do not match.");
        return false;
    }
    if (!checkbox) {
        showErrorMessage("Please accept the privacy policy.");
        return false;
    }
    return true;
}

function resetFormFields() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm_password').value = '';
    document.getElementById('privacy_checkbox').checked = false; // Reset checkbox
   
}

async function checkIfContactExists(email) {
    let url = `${Base_URL}/logindata.json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data && Object.values(data).some(contact => contact.email === email);
    } catch (error) {
        console.error("Error checking Firebase data:", error);
        return false;
    }
}

async function saveContact(email, name, password) {
    let personData = { email, name, password };
    let url = `${Base_URL}/logindata.json`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(personData)
        });
        if (!response.ok) throw new Error("Error saving contact");
        let data = await response.json();
        console.log("Contact saved:", data);
    } catch (error) {
        console.error("Error saving contact:", error);
    }
}

function showErrorMessage(message) {
    const errorMessageElement = document.querySelector('.wrong_data_alert');
    errorMessageElement.textContent = message;
    errorMessageElement.classList.add('show');
}
