function openPageLogin(){
  window.location.href = "../index.html"; 
}


function openPagePolicy(){
  window.location.href = "../HTML/guest_policy.html"; 
}


function openPageLegalNotice(){
  window.location.href = "../HTML/guest_legal_notice.html"; 
}


function openSummary(){
  window.location.href = "../HTML/summary.html"; 
}


function openTask(){
  window.location.href = "../HTML/task.html"; 
}


function openBoard(){
  window.location.href = "../HTML/board.html"; 
}


function openContact(){
  window.location.href = "../HTML/contacts.html"; 
}


function logoutGuest() {
  localStorage.removeItem('userLoggedIn');
  localStorage.setItem('greetingShown', 'false');
  }