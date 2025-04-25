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
  update();
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
