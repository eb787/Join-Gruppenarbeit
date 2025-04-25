const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

let currentTasks = [];

/**
 * This function fetches the task data from the Firebase database and updates the task list.
 */
async function fetchData() {
  let TaskResponse = await fetch(`${Base_URL}/tasks.json`);
  TaskResponse = await TaskResponse.json();
  currentTasks = Object.values(TaskResponse);
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

window.onresize = showHelpIconMobile;


/**
 * Updates the HTML content based on task data.
 */
function updateHTML() {
  const contentMap = {
    content_urgent: () => countTasks({ prio: "high_prio" }),
    content_to_do: () => countTasks({ status: "toDo" }),
    content_success: () => countTasks({ status: "done" }),
    content_date_div: getDeadlineDate,
    content_task_in_board: () => countTasks(),
    content_task_in_progress: () => countTasks({ status: "inProgress" }),
    content_awaiting_feedback: () => countTasks({ status: "awaitFeedback" }),
  };

  for (const [id, fn] of Object.entries(contentMap)) {
    document.getElementById(id).innerHTML = fn();
  }
}


/**
 * Returns the number of tasks matching the given criteria.
 * If no criteria is given, returns the total number of valid tasks.
 * @param {Object} filter - Optional filter by task properties (e.g., status or prio).
 * @returns {number}
 */
function countTasks(filter = {}) {
  return currentTasks.filter(task =>
    task && Object.entries(filter).every(([key, value]) => task[key] === value)
  ).length;
}


/**
 * Returns the deadline of the next upcoming task or a default message.
 * @returns {string}
 */
function getDeadlineDate() {
  const upcomingTask = currentTasks.find(task => task?.deadline);
  return upcomingTask ? upcomingTask.deadline : "No deadline set";
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
