let contactColorArray = [ 
    "#FC71FF", //pink
    "#6E52FF", //bluish-purple
    "#9327FF", //ligh purple
    "#FFBB2B", //yellow
    "#FF4646", //red       
    "#00BEE8", //light blue / mint
    "#0038FF", //dark blue
    "#FF7A00",  //orange
    "#1FD7C1", //turquoise
    "#462F8A", //dark purple
    "#f0eded", //grey
  ];


/**
 * This function is used to authenticate the user during login
 * Checks if both email and password are provided
 * Checks if the user with the provided email exists
 * Creates a folder for the user and saves login data locally
 */
async function userLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.querySelector('.wrong_data_alert');
    resetErrorMessage(errorMessage);

    if (!email || !password) return showErrorMessage(errorMessage, "Please fill in all fields.");

    const userData = await checkIfContactExists(email);
    if (!userData) return showErrorMessage(errorMessage, "User not found.");
    if (userData.password !== password) return showErrorMessage(errorMessage, "Incorrect password.");
    await addContactLogin(userData);

    await createUserFolder(userData);
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('greetingShown', 'false');
    window.location.href = "./HTML/summary.html";
}


/**
 * Adds a new contact for login data and sends it to the server.
 * @async
 * @param {Object|null} userData - The user data to add. If null, data will be collected from the input fields.
 */
async function addContactLogin(userData = null) {
    let newContact = userData ? {
        name: userData.name || "No Name",
        email: userData.email,
        number: userData.phone || "",
        color: globalIndex % contactColorArray.length
    } : collectContactData();

    globalIndex++;
    saveGlobalIndex();
    let contactsData = await getData("/contacts");
    let firstLetter = getFirstLetter(newContact.name);
    let contactsGroup = contactsData[firstLetter] || {};
    let newId = Object.keys(contactsGroup).length;

    contactsGroup[newId] = newContact;
    await postData(`/contacts/${firstLetter}`, contactsGroup);

    if (!userData) {
        clearInputsAndClose();
        index = newId;
        getUsersList();
    }
}


/**
 * This function sets the greeting flag for the user
 * 
 */
function setGreetingFlag() {
    if (!localStorage.getItem('greetingShown')) {
        localStorage.setItem('greetingShown', 'true'); 
    }
}


/**
 * This function checks if a user with the given email exists
 * @param {string} email - The email address of the user
 * @returns {Object|null} - Returns the user data if the user exists, otherwise null
 */
async function checkIfContactExists(email) {
    const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

    try {
        const res = await fetch(`${Base_URL}/logindata.json`);
        const data = await res.json();
        return findUserByEmail(data, email);
    } catch (error) {
        console.error("Error fetching login data:", error);
        return null;
    }
}


/**
 * This function searches for a user by their email address in the data
 * @param {Object} data - The user data from the database
 * @param {string} email - The email address of the user
 * @returns {Object|null} - Returns the user data if a match is found, otherwise null
 */
function findUserByEmail(data, email) {
    for (let id in data) {
        if (data[id].email === email) return { ...data[id], userId: id };
    }
    return null;
}


/**
 * This function resets the error message by removing its display
 * @param {HTMLElement} errorMessage - The DOM element containing the error message
 */
function resetErrorMessage(errorMessage) {
    errorMessage.classList.remove("show");
}


/**
 * This function displays an error message when there's an issue with the login
 * @param {string} message - The message to display
 */
function showErrorMessage(errorMessage, message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
}


/**
 * This function creates a folder for the user in the Firebase database
 * @param {Object} userData - The user data to be stored
 */
async function createUserFolder(userData) {
    const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

    const userFolderURL = `${Base_URL}/currentUser.json`;
    const userFolderData = { email: userData.email, name: userData.name };
    try {
        const response = await fetch(userFolderURL, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userFolderData),
        });
        if (!response.ok) throw new Error("Error creating user folder");
        console.log("User folder created:", await response.json());
    } catch (error) {
        console.error("Error creating user folder:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePasswordVisibility');
    const lockIcon = document.getElementById('lockIcon');

    passwordInput.addEventListener('input', function () {
        const hasContent = passwordInput.value.length > 0;

       
        lockIcon.style.display = hasContent ? 'none' : 'inline';
        toggleIcon.style.display = hasContent ? 'inline' : 'none';
    });

    toggleIcon.addEventListener('click', function () {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        toggleIcon.src = isPassword 
            ? "./assets/icons/visibility.svg"
            : "./assets/icons/visibility_off.svg";
    });
});


