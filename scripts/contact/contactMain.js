function openContactBigMiddle() {
  let contactMiddle = document.getElementById('contact-big-middle');

  contactMiddle.innerHTML = contactCardMiddle();
}

function deleteContactBigMiddle() {
  document.getElementById('contact-big-middle').style.display = 'none';
  deleteContactInFirebase();
}

function editContact() {
  document.getElementById('content-card-big').style.display = 'flex';

}

function openContactBig() {
  document.getElementById('content-card-big').style.display = 'flex';
}


function closeContactBig() {
  document.getElementById('content-card-big').style.display = 'none';;
}



function updateCancelButton() {
  let inputs = document.querySelectorAll('#name_input, #email_input, #tel_input');
  let cancelButton = document.getElementById('cancel-button');
  let allEmpty = true;
  inputs.forEach(input => {
    if (input.value.trim() !== "") {
      allEmpty = false;
    }
  });

  if (allEmpty) {
    cancelButton.innerText = "Cancel";
    cancelButton.setAttribute("onclick", "cancelStatus()");
  } else {
    cancelButton.innerText = "Delete";
    cancelButton.setAttribute("onclick", "deleteData()");
  }
}


function cancelStatus() {
  document.getElementById('content-card-big').style.display = 'none';;

}

function deleteData() {
  let cancelButton = document.getElementById('cancel-button');

  document.getElementById('email_input').value = "";
  document.getElementById('name_input').value = "";
  document.getElementById('tel_input').value = "";

  cancelButton.innerText = "Cancel";
  cancelButton.setAttribute("onclick", "cancelStatus()");

}