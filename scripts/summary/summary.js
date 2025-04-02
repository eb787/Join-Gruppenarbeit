const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

let currentTasks = [];

/**
 * This function fetches the task data from the Firebase database and updates the task list.
 */
async function fetchData() {
  let TaskResponse = await fetch(`${Base_URL}/tasks.json`);
  TaskResponse = await TaskResponse.json();
  currentTasks = Object.values(TaskResponse);

  console.log(currentTasks);
  update();
}


/**
 * This function updates the HTML and various components based on the current state of the application.
 * It checks if the user is logged in and shows the greeting message if necessary.
 */
function update() {
  if (isUserLoggedIn() && localStorage.getItem('greetingShown') === 'false') {
      showGreetingContainer();
  }
  updateHTML();
  renderUserLogo();
  renderInitials();
  renderCurrentUser();
  renderWelcome();
  showHelpIconMobile();
}


/**
 * This function shows a greeting container on the mobile view for a few seconds.
 */
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


/**
 * This function checks if the user is logged in by checking the 'userLoggedIn' flag in localStorage.
 * @returns {boolean} - Returns true if the user is logged in, false otherwise.
 */
function isUserLoggedIn() {
  return localStorage.getItem('userLoggedIn') === 'true';
}


/**
 * This function logs out the user by removing the 'userLoggedIn' flag from localStorage
 * and resetting the greetingShown flag.
 */
function logout() {
  localStorage.removeItem('userLoggedIn');
  localStorage.setItem('greetingShown', 'false');
}


function openPage() {
  window.location.href = "../HTML/board.html"; 
}


/**
 * This function shows the help icon on mobile screens (below 1000px width).
 */
function showHelpIconMobile() {
  let helpLink = document.getElementById("mobile_help_link");

  if (window.innerWidth <= 1000) {
    helpLink.style.display = "flex"; 
  } else {
    helpLink.style.display = "none"; 
  }
}


/**
 * This function updates the HTML content based on the current task data.
 * It updates various task-related statistics such as urgent tasks, to-do tasks, etc.
 */
function updateHTML() {
  document.getElementById("content_urgent").innerHTML = getNumberUrgent();
  document.getElementById("content_to_do").innerHTML = getNumberToDo();
  document.getElementById("content_success").innerHTML = getNumberSuccess();
  document.getElementById("content_date_div").innerHTML = getDeadlineDate();
  document.getElementById("content_task_in_board").innerHTML = getNumberTaskInBoard();
  document.getElementById("content_task_in_progress").innerHTML = getNumberTaskInProgress();
  document.getElementById("content_awaiting_feedback").innerHTML = getNumberAwaitingFeedback();
}


/**
 * This function returns the number of urgent tasks (tasks with high priority).
 * @returns {number} - The number of high-priority tasks.
 */
function getNumberUrgent() {
  return currentTasks.filter(task => task && task.prio === "high_prio").length;
}


/**
 * This function returns the number of tasks with the "toDo" status.
 * @returns {number} - The number of tasks with the status "toDo".
 */
function getNumberToDo() {
  return currentTasks.filter(task => task && task.status === "toDo").length;
}


/**
 * This function returns the number of tasks that are marked as "done".
 * @returns {number} - The number of completed tasks.
 */
function getNumberSuccess() {
  return currentTasks.filter(task => task && task.status === "done").length;
}


/**
 * This function returns the deadline of the next upcoming task, or a default message if no deadline is set.
 * @returns {string} - The deadline of the next task or "No deadline set" if none exists.
 */
function getDeadlineDate() {
  const upcomingTask = currentTasks.find(task => task && task.deadline && task.deadline !== "");
  return upcomingTask ? upcomingTask.deadline : "Keine Deadline festgelegt";
}


/**
 * This function returns the total number of tasks in the system.
 * @returns {number} - The total number of tasks.
 */
function getNumberTaskInBoard() {
  return currentTasks.length;
}


/**
 * This function returns the number of tasks with the "inProgress" status.
 * @returns {number} - The number of tasks that are in progress.
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
 * This function renders the user logo in the UI.
 */
function renderUserLogo() {
  document.getElementById("logo_user_sign_in").innerHTML = addUserLogoTemplate();
}


/**
 * This function renders the user's initials in the UI.
 * It fetches the current user's name and calculates the initials.
 */
function renderInitials() {
  let userInitials = document.getElementById('render_initials_user_logo');

  fetch(`${Base_URL}/currentUser.json`)
    .then(res => res.json())
    .then(data => {
      const userName = data.name; 
      const initials = getInitials(userName);
      userInitials.textContent = initials;
    })
    .catch(err => console.error("Error fetching user name:", err));
}


/**
 * This function calculates the initials from a full name (first and last name).
 * @param {string} name - The user's full name.
 * @returns {string} - The initials derived from the user's name.
 */
function getInitials(name) {
  const nameParts = name.split(" ");
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  return initials;
}


/**
 * This function renders the current user's name in the UI.
 */
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
    .catch(err => console.error("Error fetching user name:", err));
}


/**
 * This function renders a personalized greeting message based on the time of day.
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
