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

