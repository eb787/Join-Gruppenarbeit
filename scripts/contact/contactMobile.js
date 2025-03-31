function checkScreenSize() {
  if (window.innerWidth < 1000 && activeContact) {
    activeContact.style.backgroundColor = "white";
    activeContact.style.color = "black";
  }
}

window.addEventListener("resize", checkScreenSize);


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

function editContactMobile() {
  let contactDetail = document.querySelector('.contact_Detail');
  let createButton = document.getElementById('button_create_mobile'); 
  let saveButton = document.getElementById('save-button'); 
  let deleteButton = document.getElementById('cancel-button');
  if (window.innerWidth <= 1000) {
    contactDetail.classList.add('show');

    if (createButton) {
      createButton.style.display = "none";
    }
    if (deleteButton) {
      deleteButton.style.display = "flex";
    }
    if (saveButton) {
      saveButton.style.display = "flex";
    }
  }

}

function closeWindowMobile() {
  let mobileWindow = document.getElementById('window_options');
  mobileWindow.style.display = 'none';
  if (window.innerWidth <= 1000) {
    mobileWindow.style.display = 'none';

    }
  }



