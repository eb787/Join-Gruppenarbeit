function checkScreenSize() {
  if (window.innerWidth < 1000 && activeContact) {
    activeContact.style.backgroundColor = "white";
    activeContact.style.color = "black";
  }
}


window.addEventListener("resize", checkScreenSize);
window.addEventListener('resize', () => {
  if (window.innerWidth > 1000) {
      closeWindowMobile();
  }
});


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


function showContactList() {
  let contactList = document.getElementById("user-list");
  if (contactList) {
    contactList.style.display = "block";
  }
}


function hideContactList() {
  let contactList = document.querySelector(".contact_List");
  if (contactList) {
    contactList.style.display = "none";
  }
}


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


function editContactMobile() {
  toggleEditMobile(true);
}


function closeEditMobile() {
  toggleEditMobile(false);
}


function openWindowMobile(contactIndex, firstLetter, color) {
  let mobileWindow = document.getElementById('mobile_window');
  mobileWindow.innerHTML =
      `
<div class="mobile_options_div" id = "window_options">
  <div class="edit_mobile" onclick = "editContact('${contactIndex}', '${firstLetter}','${color}')">
      <img src="../assets/icons/edit.svg" alt="">
      <p>Edit</p>
  </div>
<div class="delete_mobile" onclick="deleteContact('${contactIndex}','${firstLetter}')" ; closeContactBigMiddleMobil();">
      <img src="../assets/icons/delete.svg" alt="">
      <p>Delete</p>
  </div>

</div>`
}


function closeWindowMobile() {
  let mobileWindow = document.getElementById('mobile_window');
  mobileWindow.innerHTML = "";
  if (window.innerWidth <= 1000) {
    mobileWindow.innerHTML = "";
    }
  }



