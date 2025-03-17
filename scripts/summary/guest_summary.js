function toggleMenu() {
    document.getElementById('submenu_toogle').classList.toggle('submenu_open');
  }
  
  document.addEventListener('click', function(event) {
    const submenu = document.getElementById('submenu_toogle');
    const toggleButton = document.getElementById('guest_logo_user_sign_in');
  
    if (!submenu.contains(event.target) && !toggleButton.contains(event.target)) {
      submenu.classList.remove('submenu_open'); 
    }
  });
  
  const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

let currentTasks = [];

async function fetchData() {
  let TaskResponse = await fetch(`${Base_URL}/tasks.json`);
  TaskResponse = await TaskResponse.json();
  // Speichern der Aufgaben im Array
  currentTasks = Object.values(TaskResponse);

  console.log(currentTasks);
  update()
}

function update(){
  updateHTML();
  renderWelcome();
}

function openPage(){
  window.location.href = "../HTML/board.html"; 
}

function updateHTML() {
  document.getElementById("content_urgent").innerHTML = getNumberToDo();
  document.getElementById("content_to_do").innerHTML = getNumberToDo();
  document.getElementById("content_success").innerHTML = getNumberSuccess();
  document.getElementById("content_date_div").innerHTML = getDeadlineDate();
  document.getElementById("content_task_in_board").innerHTML = getNumberTaskInBoard();
  document.getElementById("content_task_in_progress").innerHTML = getNumberTaskInProgress();
  document.getElementById("content_awaiting_feedback").innerHTML = getNumberAwaitingFeedback();
}

function getNumberUrgent() {
  return currentTasks.filter(task => task && task.status === "urgent").length;
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

function renderWelcome() {
  let currentWelcome = document.getElementById('content_welcome');
  
  const currentHour = new Date().getHours(); 

  let greeting = '';
  if (currentHour >= 5 && currentHour < 12) {
      greeting = 'Good morning';
  } else if (currentHour >= 12 && currentHour < 18) {
      greeting = 'Good afternoon';
  } else {
      greeting = 'Good evening';
  }
  currentWelcome.textContent = greeting;
}



