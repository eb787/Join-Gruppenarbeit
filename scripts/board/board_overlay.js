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
 * This function lets an overlay appear which makes it possible to add a new task on the board
 * @param {string} category - This parameter indicates in which column the new task should appear
*/
function showAddTaskOverlay(category) {
    if(category){
        localStorage.setItem("category", category); 
         }
    if (window.innerWidth >= 1180) {
        document.getElementById("addTask_overlay").classList.remove("brighter_background");
        document.getElementById("addTask_card").classList.remove("slide-out");
        document.getElementById("addTask_card").classList.add("slide-in"); 
        document.getElementById("addTask_overlay").classList.remove("d_none"); 
        taskAddOverlayInit();
    } else{            
        window.open('../HTML/task.html', '_self');
    
        
    }    
}
