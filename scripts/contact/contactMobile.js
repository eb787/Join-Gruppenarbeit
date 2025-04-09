/**
 * Checks the screen size and changes the styling of the active contact if the screen width is below 1000px.
 * @function
 */
function checkScreenSize() {
  if (window.innerWidth < 1000 && activeContact) {
    activeContact.style.backgroundColor = "white";
    activeContact.style.color = "black";
  }
}

// Listens for window resizing to apply changes based on screen size.
window.addEventListener("resize", checkScreenSize);

/**
 * Closes the detailed contact view on mobile screens when the width is below 1000px and shows the contact list again.
 * @function
 */
window.addEventListener('resize', () => {
  if (window.innerWidth > 1000) {
      closeWindowMobile();
  }
});

/**
 * Closes the detailed contact view on mobile and shows the contact list again.
 * @function
 */
function closeContactBigMiddleMobil() {
  let contactMiddle = getContactElement();
  if (window.innerWidth < 1000) {
    contactMiddle.classList.remove("show");
    document.querySelector(".contact_Detail").classList.remove("show");
    setTimeout(() => {
      showContactList();
    }, 300);
  }
}

/**
 * Shows the contact list on the screen.
 * @function
 */
function showContactList() {
  let contactList = document.getElementById("user-list");
  if (contactList) {
    contactList.style.display = "block";
  }
}

/**
 * Hides the contact list from the screen.
 * @function
 */
function hideContactList() {
  let contactList = document.querySelector(".contact_List");
  if (contactList) {
    contactList.style.display = "none";
  }
}

/**
 * Toggles between creating and editing contact details on mobile.
 * @function
 * @param {boolean} isEditing - Flag indicating if the contact is in editing mode.
 */
function toggleEditMobile(isEditing) {
  const contactDetail = document.querySelector('.contact_Detail');
  const createButton = document.getElementById('button_create_mobile');
  const saveButton = document.getElementById('save-button');
  const deleteButton = document.getElementById('cancel-button');
  const emailInput = document.getElementById('email_input');
  
  if (window.innerWidth > 1000) return;
  
  contactDetail.classList.add('show');
  if (createButton) createButton.style.display = isEditing ? "none" : "flex";
  if (saveButton) saveButton.style.display = isEditing ? "flex" : "none";
  if (deleteButton) deleteButton.style.display = isEditing ? "flex" : "none";
  if (!isEditing && emailInput) clearError(emailInput);
}

/**
 * Enables the editing mode for a contact on mobile.
 * @function
 */
function editContactMobile() {
  toggleEditMobile(true);
}

/**
 * Disables the editing mode and reverts to the original contact details.
 * @function
 */
function closeEditMobile() {
  toggleEditMobile(false);
}

/**
 * Opens a mobile window with options to edit or delete a contact.
 * @function
 * @param {string} contactIndex - The index of the contact to edit or delete.
 * @param {string} firstLetter - The first letter of the contact's name, used to find the group.
 * @param {string} color - The color assigned to the contact.
 */
function openWindowMobile(contactIndex, firstLetter, color) {
  let mobileWindow = document.getElementById('mobile_window');
  mobileWindow.innerHTML =
      `
<div class="mobile_options_div" id = "window_options">
  <div class="edit_mobile" onclick = "editContact('${contactIndex}', '${firstLetter}','${color}')">
      <img src="../assets/icons/edit.svg" alt="">
      <p>Edit</p>
  </div>
  <div class="delete_mobile" onclick="deleteContact('${contactIndex}','${firstLetter}'); closeContactBigMiddleMobil();">
      <img src="../assets/icons/delete.svg" alt="">
      <p>Delete</p>
  </div>
</div>`;
}

/**
 * Closes the mobile window by clearing its content.
 * @function
 */
function closeWindowMobile() {
  let mobileWindow = document.getElementById('mobile_window');
  mobileWindow.innerHTML = "";
  if (window.innerWidth <= 1000) {
    mobileWindow.innerHTML = "";
  }
}
