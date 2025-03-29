const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

let currentTasks = [];

async function fetchData() {
  let TaskResponse = await fetch(`${Base_URL}/tasks.json`);
  TaskResponse = await TaskResponse.json();
  currentTasks = Object.values(TaskResponse);

  console.log(currentTasks);
  update()
}

function update() {
  if (isUserLoggedIn() && localStorage.getItem('greetingShown') === 'false') {
      showGreetingContainer();
  }
  updateHTML();
  renderUserLogo();
  renderInitials();
  renderCurrentUser();
  renderWelcome();
}


function showGreetingContainer() {
  if (window.innerWidth < 1000) {
      const mobileContainer = document.querySelector('.mobile_container-morning');
      mobileContainer.style.display = 'flex';

      setTimeout(() => {
          mobileContainer.style.display = 'none';
          localStorage.setItem('greetingShown', 'true');
      }, 3000);
  }
}

function isUserLoggedIn() {
  return localStorage.getItem('userLoggedIn') === 'true';
}


function logout() {
  localStorage.removeItem('userLoggedIn');
  localStorage.setItem('greetingShown', 'false');
}

function openPage() {
  window.location.href = "../HTML/board.html"; 
}

function updateHTML() {
  document.getElementById("content_urgent").innerHTML = getNumberUrgent();
  document.getElementById("content_to_do").innerHTML = getNumberToDo();
  document.getElementById("content_success").innerHTML = getNumberSuccess();
  document.getElementById("content_date_div").innerHTML = getDeadlineDate();
  document.getElementById("content_task_in_board").innerHTML = getNumberTaskInBoard();
  document.getElementById("content_task_in_progress").innerHTML = getNumberTaskInProgress();
  document.getElementById("content_awaiting_feedback").innerHTML = getNumberAwaitingFeedback();
}

function getNumberUrgent() {
  return currentTasks.filter(task => task && task.prio === "high_prio").length;
}

function getNumberToDo() {
  return currentTasks.filter(task => task && task.status === "toDo").length;
}

function getNumberSuccess() {
  return currentTasks.filter(task => task && task.status === "done").length;
}

function getDeadlineDate() {
  const upcomingTask = currentTasks.find(task => task && task.deadline && task.deadline !== "");
  return upcomingTask ? upcomingTask.deadline : "Keine Deadline festgelegt";
}

function getNumberTaskInBoard() {
  return currentTasks.length;
}

function getNumberTaskInProgress() {
  return currentTasks.filter(task => task && task.status === "inProgress").length;
}

function getNumberAwaitingFeedback() {
  return currentTasks.filter(task => task && task.status === "awaitFeedback").length;
}

function renderUserLogo() {
  document.getElementById("logo_user_sign_in").innerHTML = addUserLogoTemplate();
}

function renderInitials() {
  let userInitials = document.getElementById('render_initials_user_logo');

  fetch(`${Base_URL}/currentUser.json`)
    .then(res => res.json())
    .then(data => {
      const userName = data.name; 
      const initials = getInitials(userName);
      userInitials.textContent = initials;
    })
    .catch(err => console.error("Fehler beim Abrufen des Namens:", err));
}

function getInitials(name) {
  const nameParts = name.split(" ");
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  return initials;
}

function renderCurrentUser() {
  let userDiv = document.getElementById('current_user');
  let mobileUserDiv = document.getElementById('mobile_current_user');

  fetch(`${Base_URL}/currentUser.json`)
    .then(res => res.json())
    .then(data => {
      const userName = data.name; 
      userDiv.textContent = userName;
      mobileUserDiv.textContent = userName;
    })
    .catch(err => console.error("Fehler beim Abrufen des Namens:", err));
}

function renderWelcome() {
  let currentWelcome = document.getElementById('content_welcome');
  let mobileCurrentWelcome = document.getElementById('mobie_content_welcome');
  
  const currentHour = new Date().getHours(); 

  let greeting = '';
  if (currentHour >= 5 && currentHour < 12) {
      greeting = 'Good morning,';
  } else if (currentHour >= 12 && currentHour < 18) {
      greeting = 'Good afternoon,';
  } else {
      greeting = 'Good evening,';
  }
  currentWelcome.textContent = greeting;
  mobileCurrentWelcome.textContent = greeting;
}
