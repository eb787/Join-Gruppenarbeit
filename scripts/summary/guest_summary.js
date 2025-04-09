/**
 * This function toggles the visibility of the submenu when called.
 * It adds or removes the 'submenu_open' class to/from the submenu element.
 */
function toggleMenu() {
  document.getElementById('submenu_toogle').classList.toggle('submenu_open');
}


/**
 * This event listener listens for clicks on the document.
 * It closes the submenu if the user clicks outside of the submenu and the toggle button.
 * @param {Event} event - The click event triggered by the user.
 */
document.addEventListener('click', function(event) {
  const submenu = document.getElementById('submenu_toogle');
  const toggleButton = document.getElementById('guest_logo_user_sign_in');

  if (!submenu.contains(event.target) && !toggleButton.contains(event.target)) {
    submenu.classList.remove('submenu_open'); 
  }
});


const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";


let currentTasks = [];


/**
 * This function fetches task data from the Firebase database and updates the task list.
 * It calls the update function once the data is successfully fetched.
 */
async function fetchData() {
  let TaskResponse = await fetch(`${Base_URL}/tasks.json`);
  TaskResponse = await TaskResponse.json();
  currentTasks = Object.values(TaskResponse);
  console.log(currentTasks);  update();
}


/**
 * This function updates the page content and shows a greeting if the user is logged in.
 */
function update() {
  if (isUserLoggedIn() && localStorage.getItem('greetingShown') === 'false') {
    showGreetingContainer();
  }
  updateHTML();
  renderWelcome();
}


/**
 * This function shows a greeting container for mobile users when the page loads.
 * It hides the greeting after 3 seconds and sets a flag to avoid showing it again.
 */
function showGreetingContainer() {
  if (window.innerWidth < 1000) {
    const mobileGuestContainer = document.querySelector('.mobile_container-morning');
    mobileGuestContainer.style.display = 'flex';

    setTimeout(() => {
      mobileGuestContainer.style.display = 'none';
      localStorage.setItem('greetingShown', 'true');
    }, 3000);
  }
}


/**
 * This function checks if the user is logged in by looking at the 'userLoggedIn' flag in localStorage.
 * @returns {boolean} - Returns true if the user is logged in, false otherwise.
 */
function isUserLoggedIn() {
  return localStorage.getItem('userLoggedIn') === 'true';
}


function logoutGuest() {
  localStorage.removeItem('userLoggedIn');
  localStorage.setItem('greetingShown', 'false');
}


function openPage() {
  window.location.href = "../HTML/board.html"; 
}


/**
 * This function updates the HTML content on the page, such as task statistics.
 * It updates the task counts and other relevant information.
 */
function updateHTML() {
  document.getElementById("content_urgent").innerHTML = getNumberToDo();
  document.getElementById("content_to_do").innerHTML = getNumberToDo();
  document.getElementById("content_success").innerHTML = getNumberSuccess();
  document.getElementById("content_date_div").innerHTML = getDeadlineDate();
  document.getElementById("content_task_in_board").innerHTML = getNumberTaskInBoard();
  document.getElementById("content_task_in_progress").innerHTML = getNumberTaskInProgress();
  document.getElementById("content_awaiting_feedback").innerHTML = getNumberAwaitingFeedback();
}


/**
 * This function returns the number of urgent tasks.
 */
function getNumberUrgent() {
  return currentTasks.filter(task => task && task.status === "urgent").length;
}


function getNumberToDo() {
  return currentTasks.filter(task => task && task.status === "toDo").length;
}


function getNumberSuccess() {
  return currentTasks.filter(task => task && task.status === "done").length;
}


/**
 * This function returns the deadline of the next upcoming task or a message if no deadline is set.
 */
function getDeadlineDate() {
  const upcomingTask = currentTasks.find(task => task && task.deadline && task.deadline !== "");
  return upcomingTask ? upcomingTask.deadline : "Keine Deadline festgelegt";
}


/**
 * This function returns the total number of tasks in the system that are not null.
 * @returns {number} - The total number of valid tasks.
 */
function getNumberTaskInBoard() {
  return currentTasks.filter(task => task !== null).length;
}


/**
 * This function returns the number of tasks with the "inProgress" status.
 */
function getNumberTaskInProgress() {
  return currentTasks.filter(task => task && task.status === "inProgress").length;
}


/**
 * This function returns the number of tasks awaiting feedback.
 * @returns {number} - The number of tasks awaiting feedback.
 */
function getNumberAwaitingFeedback() {
  return currentTasks.filter(task => task && task.status === "awaitFeedback").length;
}


/**
 * This function generates a greeting message based on the current hour and displays it in the UI.
 */
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
