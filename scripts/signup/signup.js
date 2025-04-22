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
 * Enables the submit button once all form fields are valid.
 * Disables the button initially and listens for input changes to check the form validity.
 */
function enableSubmitButton() {
  document.getElementById("signup_btn").disabled = true;
  const inputs = document.querySelectorAll(
    "#name, #email, #password, #confirm_password, #privacy_checkbox"
  );
  inputs.forEach((input) => {
    input.addEventListener("input", checkFormValidity);
  });
}


/**
 * Checks if the form fields are valid.
 * Enables or disables the submit button based on the form's validity.
 */
function checkFormValidity() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;
  const checkbox = document.getElementById("privacy_checkbox").checked;

  if (name && email && password && confirmPassword && password === confirmPassword && checkbox
  ) {
    document.getElementById("signup_btn").disabled = false;
  } else {
    document.getElementById("signup_btn").disabled = true;
  }
}


/**
 * Handles the user signup process.
 * Validates the form, checks if the email already exists, saves the new contact, and navigates to the home page.
 */
async function addUserSignUp() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirm_password").value;
  let checkbox = document.getElementById("privacy_checkbox").checked;
  let userData = { email, name, password };
  if (!checkInput(name, email, password, confirmPassword, checkbox)) return;
  if (await checkIfContactExists(email)) {
    showErrorMessage("A contact with this email address already exists.");
    return;}
  await saveContact(email, name, password);
  await addContactLogin(userData);
  document.getElementById("successful_signin_btn").style.display = "flex";
  resetFormFields();
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 2000);
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
 * Validates user input before submitting the form.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} confirmPassword - The confirmation of the user's password.
 * @param {boolean} checkbox - The user's acceptance of the privacy policy.
 * @returns {boolean} - Returns true if the input is valid, otherwise false.
 */
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


/**
 * Resets the form fields to their initial state.
 */
function resetFormFields() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirm_password").value = "";
  document.getElementById("privacy_checkbox").checked = false; // Reset checkbox
}


/**
 * Checks if a contact with the specified email already exists in the database.
 * @param {string} email - The email address to check.
 * @returns {boolean} - Returns true if the contact exists, otherwise false.
 */
async function checkIfContactExists(email) {
  const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";
  let url = `${Base_URL}/logindata.json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return (
      data && Object.values(data).some((contact) => contact.email === email)
    );
  } catch (error) {
    console.error("Error checking Firebase data:", error);
    return false;
  }
}


/**
 * Saves the new user's contact data to the database.
 * @param {string} email - The user's email address.
 * @param {string} name - The user's name.
 * @param {string} password - The user's password.
 */
async function saveContact(email, name, password) {
  const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";
  let personData = { email, name, password };
  let url = `${Base_URL}/logindata.json`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(personData),
    });
    if (!response.ok) throw new Error("Error saving contact");
    let data = await response.json();
    console.log("Contact saved:", data);
  } catch (error) {
    console.error("Error saving contact:", error);
  }
}


/**
 * Toggles password visibility and manages the display of lock/eye icons.
 * @param {string} fieldId - The ID of the password input field.
 * @param {string} iconId - The ID of the eye icon (for toggling visibility).
 * @param {string} lockIconId - The ID of the lock icon (shown when password is hidden).
 */
document.addEventListener("DOMContentLoaded", function () {
  // Helper function to remove error message
  function removeErrorMessage() {
    const errorMessageElement = document.querySelector(".wrong_data_alert");
    errorMessageElement.classList.remove("show");  // Klasse entfernen
    errorMessageElement.style.opacity = 0;  // Opazität setzen, um die Animation sicherzustellen
  }

  // Helper function to show error message
  function showErrorMessage(message) {
    const errorMessageElement = document.querySelector(".wrong_data_alert");
    errorMessageElement.textContent = message;
    errorMessageElement.classList.add("show");  // Klasse hinzufügen
    errorMessageElement.style.opacity = 1;  // Opazität erhöhen, um die Fehlermeldung anzuzeigen
  }

  const nameInput = document.getElementById("name");
nameInput.addEventListener("blur", () => {
  const name = nameInput.value.trim();

  // Case 1: Name is empty
  if (name === "") {
    showErrorMessage("Please enter your name.");
    return;
  }

  // Case 2: Optional – Name contains invalid characters
  const nameRegex = /^[a-zA-Z\s'-]+$/; // erlaubt Buchstaben, Leerzeichen, Apostroph und Bindestrich
  if (!nameRegex.test(name)) {
    showErrorMessage("Please enter a valid name (letters only).");
    return;
  }

  removeErrorMessage();
});


  // Password visibility toggle
  function togglePasswordVisibility(fieldId, iconId, lockIconId) {
    const passwordField = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);
    const lockIcon = document.getElementById(lockIconId);

    passwordField.addEventListener("input", function () {
      const hasValue = passwordField.value.length > 0;
      icon.style.display = hasValue ? "block" : "none";
      lockIcon.style.display = hasValue ? "none" : "block";
    });

    icon.addEventListener("click", function () {
      const isVisible = passwordField.type === "text";
      passwordField.type = isVisible ? "password" : "text";
      icon.src = isVisible
        ? "../assets/icons/visibility_off.svg"
        : "../assets/icons/visibility.svg";
    });
  }

  togglePasswordVisibility("password", "togglePasswordVisibility", "togglePassword");
  togglePasswordVisibility("confirm_password", "toggleConfirmVisibility", "toggleConfimrPassword");



  // ✅ Email validation on blur
  const emailInput = document.getElementById("email");
  emailInput.addEventListener("blur", () => {
    const email = emailInput.value.trim();
    if (email && !email.includes("@")) {
      showErrorMessage("Please enter a valid email address.");
    } else {
      removeErrorMessage();
    }
  });

  emailInput.addEventListener("blur", async () => {
    const email = emailInput.value.trim();
  
    if (email && !email.includes("@")) {
      showErrorMessage("Please enter a valid email address.");
      return;
    }
  
    if (email && await checkIfContactExists(email)) {
      showErrorMessage("A contact with this email address already exists.");
      return;
    }
  
    removeErrorMessage();
  });
  

  // ✅ Password validation on blur
  const passwordInput = document.getElementById("password");
  passwordInput.addEventListener("blur", () => {
    const password = passwordInput.value.trim();
    if (password && password.length < 4) {
      showErrorMessage("Password must be at least 4 characters long.");
    } else {
      removeErrorMessage();
    }
  });

  // ✅ Confirm password validation on blur
  const confirmPasswordInput = document.getElementById("confirm_password");
  confirmPasswordInput.addEventListener("blur", () => {
    const password = document.getElementById("password").value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (confirmPassword && password !== confirmPassword) {
      showErrorMessage("Passwords do not match.");
    } else {
      removeErrorMessage();
    }
  });

  // Revalidate on input events to remove error messages in real time
  document.getElementById("email").addEventListener("input", function () {
    removeErrorMessage();
  });
  document.getElementById("password").addEventListener("input", function () {
    removeErrorMessage();
  });
  document.getElementById("confirm_password").addEventListener("input", function () {
    removeErrorMessage();
  });
});
