const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

let currentTasks = {}; /** This is the object, where all tasks are saved*/
let currentTask = {}; /** This is the object, which is used to post new data on the database*/
let elementToBeDropped = ""; /** This is the variable where the id number is saved when starting to drag an element*/
let newFinishedTasks = 0; /** This is the variable which saves the change of the number of tasks done*/
let DragCounter = 0; /** This variable counts the amount of times the element has been pulled over a drop zone */
let x = 0; /** This variable indicates the horizontal mouseposition */
let y = 0; /** This variable indicates the vertical mouseposition */


/** 
 * This function is used to load Data from the database
 * It also created content on the board page based on the received data
 * 
*/
async function loadTaskData() {
    await fetchTaskData();
    updateTaskBoard();
    document.getElementById("full_content").innerHTML += getBgOverlay();
    document.getElementById("full_content").innerHTML += getAddTaskOverlay();
    document.getElementById('full_content').innerHTML += getBgCategory();
    adaptBoardHeight();
    showHelpIconMobile();
}


/** 
 * This function is used to save Data from the database into an array
*/
async function fetchTaskData() {
    currentTasks = [];
    let TaskResponse = await fetch(Base_URL + "/tasks/" + ".json");
    TaskResponseToJson = await TaskResponse.json();
    currentTasks = Object.values(TaskResponseToJson);
}


/**
 * This function logs out the user by removing the 'userLoggedIn' flag from localStorage
 * and resetting the greetingShown flag.
 */
function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.setItem('greetingShown', 'false');
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
 * This function adapts the height of the board based on the column which is most filled with cards.
 * This is necessary to be able to drop cards at the bottom in case one column is much longer than anther
*/
function adaptBoardHeight() {
    window.addEventListener("load", adjustHeight());
    window.addEventListener("resize", adjustHeight());
}


/** 
 * This function finds out the height of each column and saves the longest column in the parameter @param {number} maxHeight
 * In the desktop version it then assigns this height to all columns
*/
function adjustHeight() {
    let maxHeight = 0;
    document.querySelectorAll(".board_content_colums_cards").forEach(el => {
        let height = el.scrollHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    });
    if (window.innerWidth >= 1370) {
        document.querySelectorAll(".board_content_box").forEach(el => {
            el.style.minHeight = maxHeight + "px";
        });
    }
}


/** 
 * This function is used to prevent the default functions of html/JavaScript so that dropping elements becomes possible
*/
function allowDrop(event) {
    event.preventDefault();
}


/** 
 * This function is used to place a box in the column where an element is about to be dropped, indicating that dropping the element is possible at this location
 * @param {number} DragCounter - This parameter counts the amount of times the element has been pulled over a drop zone
*/
function showDottedBox(event) {
    event.preventDefault();
    let dropzone = event.currentTarget;
    let placeholder = dropzone.querySelector('.placeholder');
    if (placeholder) {
        placeholder.style.display = "block";
    }
    DragCounter++;
}


/** 
 * This function is used to remove the box from the column when an element has left the dropzone, indicating that the dropping is not posssible at the current mouse position
 * @param {number} DragCounter - This parameter counts the amount of times the element has been pulled over a drop zone
*/
function removeDottedBox(event) {
    let dropzone = event.currentTarget;
    let placeholder = dropzone.querySelector('.placeholder');
    DragCounter--;
    if (DragCounter == 0) {
        if (placeholder) {
            placeholder.style.display = "none";
        }
    }
}


/** 
 * This function is used to rotate the card element which the user is dragging in order to visualize which element they are moving
 * @param {number} index - This parameter is the index number of the element which is being moved
*/
function startDragging(index) {
    document.getElementById('card_number_' + index).classList.add('rotate_card');
    elementToBeDropped = index;
}


/** 
 * When dropping an element, this function is used to place the card in the new column an to delete the card at the old position y updating the whole board
 * It also updates the data on the database
 * @param {number} elementToBeDropped - This parameter is the index number of the element which is being moved
 * @param {string} category - This parameter indicates the category, meaning the column, where the card belongs to
*/
async function moveTo(category, event) {
    event.preventDefault();
    let dropzone = event.currentTarget;
    let placeholder = dropzone.querySelector('.placeholder');
    if (placeholder) {
        placeholder.style.display = "none";
    }
    DragCounter = 0;
    moveCard(elementToBeDropped, category)
}


/** 
 * This function is used to change the category of the task and to show the new order at the board page
 * @param {string} category - This parameter indicates the category, meaning the column, where the card belongs to
*/
async function moveCard(elementToBeDropped, category) {
    currentTasks[elementToBeDropped].status = category;
    currentTask = currentTasks[elementToBeDropped];
    await changeCategory(`/tasks/${elementToBeDropped}`, currentTask);
    loadTaskData();
}


/** 
 * This function is used to change the category of the task on the database
*/
async function changeCategory(path = "", newObj) {
    await fetch(Base_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newObj)
    });
}


/** 
 * This function is used to check if the input field is empty or not
 * It marks the input field blue if the inputfield is not empty lets only titles including the searched words appear at the board
 * And removes the blue mark when and updates the board cards when it is empty (e.g. when letter have been deleted)
*/
function startTyping() {
    document.getElementById('input_board').classList.add('input_board_searching');
    if (document.getElementById('inputfield_board').value == "") {
        refreshFoundResults();
    } else {
        compareTitleWithCurrentTasks(0, document.getElementById('inputfield_board').value);
    }
}


/** 
 * This function is used to add an alert if the title has not been found
 * In case the title has been found, it shows found titles on the board
*/
function findTask() {
    let titleToFind = document.getElementById('inputfield_board').value;
    let counter = 0;
    if (titleToFind == "") {
        showNoTaskFoundAlert(counter);
    } else {
        compareTitleWithCurrentTasks(counter, titleToFind);
        document.getElementById('inputfield_board').value = "";
    }
    document.getElementById('input_board').classList.remove('input_board_searching');
}


/** 
 * This function compares the search result with the currrent tasks
 * It also let those cards appear on the board, where the titles match the search result
 * @param {number} counter - This parameter counts how many tasks match the search result, since only the first time, the board should be emptied
 * @param {string} titleToFind - This is the search result
*/
function compareTitleWithCurrentTasks(counter, titleToFind) {
    for (let index = 0; index < currentTasks.length; index++) {
        if (currentTasks[index]) {
            if (currentTasks[index].title.toLowerCase().includes(titleToFind.toLowerCase()) || currentTasks[index].description.toLowerCase().includes(titleToFind.toLowerCase())) {
                counter = counter + 1;
                if (counter == 1) {
                    emptyBoard();
                }
                updateBoardBasedOnFindings(index);
            }
        }
    }
    showNoTaskFoundAlert(counter);
}


/** 
 * This function lets the card appear on the board, which is indicated by the index number
 * @param {number} index - This parameter indicates which task card should appear on the board
*/
function updateBoardBasedOnFindings(index) {
    showCardOnBoard(index);
    closeAlert();
    document.getElementById('back_icon').classList.remove('d_none');
    document.getElementById('search_icon').classList.add('d_none');
}


/** 
 * This function lets an alert box appear, indicating that no tasks have been found
 * @param {number} counter - This parameter saves the amount of tasks matching the search result
*/
function showNoTaskFoundAlert(counter) {
    if (counter == 0) {
        document.getElementById('no_element_found_alert').classList.remove('d_none');
        document.getElementById('input_board').classList.add('alert_input');
        document.getElementById('back_icon').classList.add('d_none');
        document.getElementById('search_icon').classList.remove('d_none');
        setTimeout(() => {
            closeAlert();
        }, 5000);
        updateTaskBoard();
        document.getElementById('back_icon').classList.add('d_none');
        document.getElementById('search_icon').classList.remove('d_none');
    }
}


/** 
 * This function removes the alert box which indicates that no tasks have been found
*/
function closeAlert() {
    document.getElementById('no_element_found_alert').classList.add('d_none');
    document.getElementById('input_board').classList.remove('alert_input');
}


/** 
 * This function makes the back-arrow dissapear and the seach-icon appear on the input field
 * It also updates the board
*/
function refreshFoundResults() {
    document.getElementById('back_icon').classList.add('d_none');
    document.getElementById('search_icon').classList.remove('d_none');
    document.getElementById('inputfield_board').value = "";
    updateTaskBoard();
    document.getElementById('input_board').classList.remove('input_board_searching');
}



