const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

let currentTasks = {}; /** This is the object, where all tasks are saved*/
let currentTask = {}; /** This is the object, which is used to post new data on the database*/
let elementToBeDropped = ""; /** This is the variable where the id number is saved when starting to drag an element*/
let newFinishedTasks = 0; /** This is the variable which saves the change of the number of tasks done*/
let DragCounter = 0; /** This variable counts the amount of times the element has been pulled over a drop zone

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
    adaptBoardHeight();
    showHelpIconMobile();
}

/** 
 * This function is used to save Data from the database into an array
*/
async function fetchTaskData(){
    currentTasks = [];
    let TaskResponse = await fetch(Base_URL + "/tasks/" + ".json");
    TaskResponseToJson = await TaskResponse.json();  

    for (let index = 0; index < TaskResponseToJson.length; index++) {
        if (TaskResponseToJson[index]) {
            currentTasks[index] = TaskResponseToJson[index];
        }
    }  
}

/** 
 * This function shows every card on the taskboard
*/
function updateTaskBoard() {
    emptyBoard();
    for (let index = 0; index < currentTasks.length; index++) {
        if (currentTasks[index]) {
        showCardOnBoard(index);
        }    
    }
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
 * This function deletes all task cards from the board and places an indicator that there are no tasks in the column
*/
function emptyBoard() {
    document.getElementById("toDo").innerHTML = getNoTasksToDoCard();
    document.getElementById("toDo").innerHTML += getPlaceholder();
    document.getElementById("inProgress").innerHTML = getNoTasksInProgressCard();
    document.getElementById("inProgress").innerHTML += getPlaceholder();
    document.getElementById("awaitFeedback").innerHTML = getNoTasksAwaitFeedbackCard();
    document.getElementById("awaitFeedback").innerHTML += getPlaceholder();
    document.getElementById("done").innerHTML = getNoTasksDoneCard();
    document.getElementById("done").innerHTML += getPlaceholder();
}

/** 
 * This function puts one card on the board
 * @param {number} index - This is the index number of the task which is shown on the board
 * @param {string} layer - This is the parameter indicating whether the function is used for the card or for the overlay
*/
function showCardOnBoard(index) {
    let subtasks = currentTasks[index].subtasks.total;
    let progress =  currentTasks[index].subtasks.number_of_finished_subtasks / subtasks * 100;
    let layer = "";
  
    getCard(index, layer);
    checkCategory(index, layer);
    checkSubtasks(subtasks, index, progress, layer);
    checkDescription(index, layer);
    checkBoardContacts(index, layer);
}

/** 
 * This function puts one card template on the board at the right position an removes the column-is-empty-sign
 * @param {number} index - This is the index number of the task which is shown on the board
 * @param {string} layer - This is the parameter indicating whether the function is used for the card or for the overlay
*/
function getCard(index, layer){
    document.getElementById("no_task_" + currentTasks[index].status).classList.add("d_none");
    document.getElementById(currentTasks[index].status).innerHTML += getExampleCard(index, layer);
}

/** 
 * This function changes the category to userStory if needed, since it is assigned Technical Task by default
 * @param {number} index - This is the index number of the task which is shown on the board
 * @param {string} layer - This is the parameter indicating whether the function is used for the card or for the overlay
*/
function checkCategory(index, layer){
    if (currentTasks[index].category == "User Story") {
        document.getElementById("category_" + index + layer).classList.add("user_story" + layer);
        document.getElementById("category_" + index + layer).classList.remove("technical_task" + layer);
    }
}

/** 
 * This function is used to indicate the correct priority at the card
 * @param {number} index - This is the index number of the task which is shown on the board
*/
function checkPriority(index) {
    let prio = "Medium";
    if (currentTasks[index].prio == "high_prio") {
        prio = "High";
    } else if (currentTasks[index].prio == "low_prio") {
        prio = "Low";
    }   
    document.getElementById('prio_text_' + index).innerHTML = prio;
}

/** 
 * This function is used to find out, whether the task has subtasks
 * If this is the case, it creates an area, where this is indicated at the card
 * @param {number} index - This is the index number of the task which is shown on the board
 * @param {number} progress - This parameter indicates the percentage of subtasks which are marked as done
 * @param {number} subtasks - This is the number of total subtasks
 * @param {string} layer - This is the parameter indicating whether the function is used for the card or for the overlay
*/
function checkSubtasks(subtasks, index, progress, layer) {
    if (subtasks != 0) {
        document.getElementById("subtasks_box" + index + "_" + layer).innerHTML = getSubtasks(index, subtasks, progress, layer);
    } 
}

/** 
 * This function is used to find out, whether the task has a description
 * If this is not the case, it removes the area for the description text on the card
 * @param {string} layer - This is the parameter indicating whether the function is used for the card or for the overlay
 * @param {number} index - This is the index number of the task which is shown on the board
*/
function checkDescription(index, layer) {
    if (currentTasks[index].description == "empty") {
        document.getElementById("description_" + index + "_" + layer).classList.add("d_none");
    }
}

/** 
 * This function is used to find out, whether the task has assigned contacts
 * If this is the case, it adds a field on the card for the contact badges
 * @param {string} layer - This is the parameter indicating whether the function is used for the card or for the overlay
 * @param {number} index - This is the index number of the task which is shown on the board
*/
function checkBoardContacts(index, layer) {
    if (currentTasks[index].contacts) {
        showContacts(index, layer);
    } else {
       document.getElementById("Profile_badges_" + index + "_" + layer).innerHTML = "";
    }
}

/** 
 * This function is used to show all (max five) assigned contacts on the task card
 * @param {string} layer - This is the parameter indicating whether the function is used for the card or for the overlay
 * @param {number} index - This is the index number of the task which is shown on the board
*/
function showContacts(index, layer) {
    if (currentTasks[index].contacts.length > 5 && layer == "") {
        for (let i = 0; i < 5; i++) {
            getCorrectContact(index, i, layer);
        }
        document.getElementById("Profile_badges_" + index + "_" + layer).innerHTML += getContactDots();
    } else {
        for (let i = 0; i < currentTasks[index].contacts.length; i++) {
                    getCorrectContact(index, i, layer);
        }
    } 
}

/** 
 * This function is used to get the correct contact and to add a profile badge on the card
 * @param {string} layer - This is the parameter indicating whether the function is used for the card or for the overlay
 * @param {number} index - This is the index number of the task which is shown on the board
 * @param {number} i - This is the index number of the contact of the task
*/
function getCorrectContact(index, i, layer) {
        document.getElementById("Profile_badges_" + index + "_" + layer).innerHTML += getContactIcon(index, i, layer);
        getContactInitials(index, i, layer);
}

/** 
 * This function is used to get the initials of the contact and to place it in the profile badge
 * @param {string} layer - This is the parameter indicating whether the function is used for the card or for the overlay
 * @param {number} index - This is the index number of the task which is shown on the board
 * @param {number} i - This is the index number of the contact of the task
*/
function getContactInitials(index, i, layer) {
    let names = currentTasks[index].contacts[i].name.split(' ');
    let initialsBoard = "";
    for (let a = 0; a < names.length; a++) {
        initialsBoard += names[a].substr(0,1);
    }
    document.getElementById("profile_" + index + "_" + i + "_" + layer).innerHTML += initialsBoard.toUpperCase();
}

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
 * @param {string} category - This parameter indicated the category, meaning the column, where the card belongs to
*/
async function moveTo(category, event) {
    event.preventDefault();
    let dropzone = event.currentTarget;
    let placeholder = dropzone.querySelector('.placeholder');
    if (placeholder) {
        placeholder.style.display = "none";
    }
    DragCounter = 0;
    currentTasks[elementToBeDropped].status = category;
    currentTask = currentTasks[elementToBeDropped];
    await changeCategory(`/tasks/${elementToBeDropped}`, currentTask);
    loadTaskData();
}

/** 
 * This function is used to change the category of the task on the database
*/
async function changeCategory(path = "", newObj) {
    await fetch(Base_URL + path + ".json",{
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newObj)
    });
}

/** 
 * This function is used to generate an overlay indicating all data of the task
 *  @param {number} index - This is the index number of the task which is shown on the overlay
*/
function showCardOverlay(index) {
    document.getElementById("bg_overlay").classList.remove("d_none");
    document.getElementById("bg_overlay").innerHTML = getCardOverlayContent(index);
    let layer = "_overlay";
    checkCategory(index, layer)
    checkPriority(index);
    showSubtasksOnOverlay(index);
    showContactsOnOverlay(index);

}

/** 
 * This function is used to check whether the task has subtasks
 * If this is the case, it creates a space on the overlay to indicate the subtasks and also indicates whethere they are done or not
 * @param {number} index - This is the index number of the task which is shown on the overlay
 * @param {number} i - This is the index number of the subtask of the task which is shown on the overlay
*/
function showSubtasksOnOverlay(index) {
    if (currentTasks[index].subtasks.total != 0) {
        document.getElementById("subtasks_box_overlay" + index).innerHTML = getSubtasksOverlay(index);
        for (let i = 0; i < currentTasks[index].subtasks.total; i++) {
            document.getElementById("tasks_box" + index).innerHTML += getTaskOverlay(index, i);
            updateCheckboxSubtasks(index, i);
        }
    } 
}

/** 
 * This function is used to check whether the subtask is done
 * If this is the case, the checkbox gets replaced with a check mark
 * @param {number} index - This is the index number of the task which is shown on the overlay
 * @param {number} i - This is the index number of the subtask of the task which is shown on the overlay
*/
function updateCheckboxSubtasks(index, i) {
    if (Object.values(currentTasks[index].subtasks.subtasks_todo)[i] == "done") {
        document.getElementById("check_box_" + index + "_btn" + i).classList.add("checked_box");
        document.getElementById("check_box_" + index + "_info" + i).classList.add("task_info_done");
    }
}

/** 
 * This function is used to show the contacts (if assigned to the task) on the overlay
 * @param {number} index - This is the index number of the task which is shown on the overlay
 * @param {number} i - This is the index number of the contact of the task which is shown on the overlay
 * @param {string} layer - This is the parameter indicating whether the function is used for the task card or for the overlay
*/
function showContactsOnOverlay(index) {
    if (currentTasks[index].contacts) {
        document.getElementById("task_description_overlay_" + index).innerHTML = getContactBoxOverlay(index);
        for (let i = 0; i < currentTasks[index].contacts.length; i++) {
            document.getElementById("profile_badges_overlay" + index).innerHTML += getContactIconOverlay(index, i);
            let layer = "overlay"
            getContactInitials(index, i, layer)
        }
    }
}

/** 
 * This function is used to close the overlay
 * @param {string} specifier - This is the parameter indicating whether the function is used for the task overlay or for the add task overlay
*/
function closeOverlay(specifier) {
    if (specifier == "bg_overlay") {
        document.getElementById("card_overlay").classList.remove("slide-in");
        document.getElementById("card_overlay").classList.add("slide-out");
    } else if (specifier == "addTask_overlay") {
        document.getElementById("addTask_card").classList.remove("slide-in");
        document.getElementById("addTask_card").classList.add("slide-out");
        document.getElementById(specifier).classList.add("brighter_background");
    }
    setTimeout(() => {
            if (specifier == "bg_overlay") {
            document.getElementById('card_overlay').innerHTML = "";
            }
            document.getElementById(specifier).classList.add("d_none");
        }, 200);
}

/** 
 * This function is used to prevent the overlay from closing when clicking on the overlay card
*/
function stopPropagation(event){
    event.stopPropagation();
}

/** 
 * This function is used to change the category of the subtask from "done" to "to do" or vice versa
 * While the data is saved on the database, the button get disabled
 * @param {number} index - This is the index number of the task in quetion
 * @param {number} i - This is the index number of the subtask in question
*/
async function changeSubtaskCategory(index, i){
    document.getElementById('subtasks_box_overlay' + index).classList.add('disable');
    let div =  document.getElementById("check_box_" + index + "_btn" + i);
    let box = document.getElementById("check_box_" + index + "_info" + i);
    let task = Object.keys(currentTasks[index].subtasks.subtasks_todo)[i];
    newFinishedTasks = currentTasks[index].subtasks.number_of_finished_subtasks;
    div.classList.toggle("checked_box");
    box.classList.toggle("task_info_done");
    await checkCurrentCategory(div, index, task, newFinishedTasks);
    await fetchTaskData();
    updateTaskBoard();
    document.getElementById('subtasks_box_overlay' + index).classList.remove('disable');
}

/** 
 * This function is used to find out the current category of the task
 * @param {number} index - This is the index number of the task in quetion
 * @param {number} task - This is the index number of the subtask in question
 * @param {string} div - This is the div container, which needs to be changed in line with the status of the subtask
 * @param {number} newFinishedTasks - This is the new number of subtasks done
*/
async function checkCurrentCategory(div, index, task, newFinishedTasks) {
    if (div.classList.contains("checked_box")) {
        await changeTaskStatus(index, task, "done");
        newFinishedTasks = newFinishedTasks + 1;
        await changeNumberOfFinishedTasks(index, newFinishedTasks);
    } else if (div.classList.contains("checked_box") == false) {
        await changeTaskStatus(index, task, "todo");
        newFinishedTasks = newFinishedTasks - 1;
        await changeNumberOfFinishedTasks(index, newFinishedTasks);
    }
}

/** 
 * This function is used to save the subtask status on the database
 * @param {number} index - This is the index number of the task in quetion
 * @param {number} task - This is the index number of the subtask in question
 * @param {number} status - This is the status data which needs to be updated
*/
async function changeTaskStatus(index, task, status) {
            await fetch(Base_URL + `/tasks/${index}/subtasks/subtasks_todo/${task}` + ".json",{
                method: "PUT",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(status)
            });
}

/** 
 * This function is used to save the number of finsihed subtask on the database
 * @param {number} index - This is the index number of the task in quetion
 * @param {number} newFinishedTasks - This is the index number of the subtasks marked as done
*/
async function changeNumberOfFinishedTasks(index, newFinishedTasks) {
            await fetch(Base_URL + `/tasks/${index}/subtasks/number_of_finished_subtasks` + ".json",{
                method: "PUT",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newFinishedTasks)
            });
}

/** 
 * This function is used to delete a task
 * @param {number} index - This is the index number of the task in quetion
*/
async function deleteTask(index) {
    currentTasks[index] = {};
    await deleteTaskData(`/tasks/${index}`);
    location.reload();
}    

/** 
 * This function is used to delete a task on the database
*/
async function deleteTaskData(path = "") {
    await fetch(Base_URL + path + ".json",{
        method: "DELETE",
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
        document.getElementById('input_board').classList.remove('input_board_searching');
        updateTaskBoard();
    } else{
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
            if (currentTasks[index].title.toLowerCase().includes(titleToFind.toLowerCase())) {
                counter = counter + 1;
                if (counter == 1) {
                    emptyBoard();
                }
                showCardOnBoard(index);
                closeAlert();
            }
        }
    } 
    showNoTaskFoundAlert(counter);
}

/** 
 * This function lets an alert box appear, indicating that no tasks have been found
 * @param {number} counter - This parameter saves the amount of tasks matching the search result
*/
function showNoTaskFoundAlert(counter) {
    if (counter == 0) {
        document.getElementById('no_element_found_alert').classList.remove('d_none');
        document.getElementById('input_board').classList.add('alert_input');
        setTimeout(() => {
            closeAlert();
        }, 5000);
        updateTaskBoard();
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
 * This function an overlay appear which makes it possible to add a new task on the board
 * @param {string} category - This parameter indicates in which column the new task should appear
*/
function showAddTaskOverlay(category) {
    if(category){
        localStorage.setItem("category", category); 
        console.log("Rufe folgende Category auf ",category);
        taskAddOverlayInit();
    }
    if (window.innerWidth >= 1180) {
        document.getElementById("addTask_overlay").classList.remove("brighter_background");
        document.getElementById("addTask_card").classList.remove("slide-out");
        document.getElementById("addTask_card").classList.add("slide-in"); 
        document.getElementById("addTask_overlay").classList.remove("d_none"); 
    } else{
        window.open('../HTML/task.html', '_self');
    }    
}

