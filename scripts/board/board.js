const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

let currentTasks = {};
let currentTask = {};
let elementToBeDropped = "";
let newFinishedTasks = 0;


async function loadTaskData() {
    await fetchTaskData();
    updateTaskBoard();
    document.getElementById("full_content").innerHTML += getBgOverlay(); 
    document.getElementById("full_content").innerHTML += getAddTaskOverlay();
    adaptBoardHeight();
}


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


function updateTaskBoard() {
    emptyBoard();
    for (let index = 0; index < currentTasks.length; index++) {
        if (currentTasks[index]) {
        showCardOnBoard(index);
        }    
    }
}


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


function showCardOnBoard(index) {
    let subtasks = currentTasks[index].subtasks.total;
    let progress =  currentTasks[index].subtasks.number_of_finished_subtasks / subtasks * 100;
    let layer = "";
  
    checkProgressStep(index, layer);
    checkCategory(index, layer);
    checkSubtasks(subtasks, index, progress, layer);
    checkDescription(index, layer);
    checkBoardContacts(index, layer);
}


function checkProgressStep(index, layer){
    document.getElementById("no_task_" + currentTasks[index].status).classList.add("d_none");
    document.getElementById(currentTasks[index].status).innerHTML += getExampleCard(index, layer);
}


function checkCategory(index, layer){
    if (currentTasks[index].category == "User Story") {
        document.getElementById("category_" + index + layer).classList.add("user_story" + layer);
        document.getElementById("category_" + index + layer).classList.remove("technical_task" + layer);
    }
}


function checkPriority(index) {
    let prio = "Medium";
    if (currentTasks[index].prio == "high_prio") {
        prio = "High";
    } else if (currentTasks[index].prio == "low_prio") {
        prio = "Low";
    }   
    document.getElementById('prio_text_' + index).innerHTML = prio;
}


function checkSubtasks(subtasks, index, progress, layer) {
    if (subtasks != 0) {
        document.getElementById("subtasks_box" + index + "_" + layer).innerHTML = getSubtasks(index, subtasks, progress, layer);
    } 
}


function checkDescription(index, layer) {
    if (currentTasks[index].description == "empty") {
        document.getElementById("description_" + index + "_" + layer).classList.add("d_none");
    }
}


function checkBoardContacts(index, layer) {
    if (currentTasks[index].contacts) {
        showContacts(index, layer);
    } else {
       document.getElementById("Profile_badges_" + index + "_" + layer).innerHTML = "";
    }
}


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


function getCorrectContact(index, i, layer) {
        document.getElementById("Profile_badges_" + index + "_" + layer).innerHTML += getContactIcon(index, i, layer);
        getContactInitials(index, i, layer);
}


function getContactInitials(index, i, layer) {
    let names = currentTasks[index].contacts[i].name.split(' ');
    let initialsBoard = "";
    for (let a = 0; a < names.length; a++) {
        initialsBoard += names[a].substr(0,1);
    }
    document.getElementById("profile_" + index + "_" + i + "_" + layer).innerHTML += initialsBoard.toUpperCase();
}


function adaptBoardHeight() {
    window.addEventListener("load", adjustHeight());
    window.addEventListener("resize", adjustHeight());
}


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
let DragCounter = 0;

function allowDrop(event) {
    event.preventDefault();
}


function showDottedBox(event) {
    event.preventDefault();
    let dropzone = event.currentTarget;
    let placeholder = dropzone.querySelector('.placeholder');
    if (placeholder) {
        placeholder.style.display = "block";
    }


    DragCounter++;
    // event.currentTarget.classList.add('input_board_searching');
}


function removeDottedBox(event) {
    let dropzone = event.currentTarget;
    let placeholder = dropzone.querySelector('.placeholder');
    // if (placeholder) {
    //     placeholder.style.display = "none";
    // }


    DragCounter--;
    if (DragCounter == 0) {
        if (placeholder) {
            placeholder.style.display = "none";
        }
    }
    // if (DragCounter == 0) {
    //      event.currentTarget.classList.remove('input_board_searching');
    // }
}


function startDragging(index) {
    document.getElementById('card_number_' + index).classList.add('rotate_card');
    elementToBeDropped = index;
}


async function moveTo(category, event) {
    event.preventDefault();
    let dropzone = event.currentTarget;
    let placeholder = dropzone.querySelector('.placeholder');
    if (placeholder) {
        placeholder.style.display = "none";
    }



    DragCounter = 0;
    // event.currentTarget.classList.remove('input_board_searching');
    currentTasks[elementToBeDropped].status = category;
    currentTask = currentTasks[elementToBeDropped];
    await changeCategory(`/tasks/${elementToBeDropped}`, currentTask);
    loadTaskData();
}


async function changeCategory(path = "", newObj) {
    await fetch(Base_URL + path + ".json",{
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newObj)
    });
}


function showCardOverlay(index) {
    document.getElementById("bg_overlay").classList.remove("d_none");
    document.getElementById("bg_overlay").innerHTML = getCardOverlayContent(index);
    let layer = "_overlay";
    checkCategory(index, layer)
    checkPriority(index);
    showSubtasksOnOverlay(index);
    showContactsOnOverlay(index);

}


function showSubtasksOnOverlay(index) {
    if (currentTasks[index].subtasks.total != 0) {
        document.getElementById("subtasks_box_overlay" + index).innerHTML = getSubtasksOverlay(index);
        for (let i = 0; i < currentTasks[index].subtasks.total; i++) {
            document.getElementById("tasks_box" + index).innerHTML += getTaskOverlay(index, i);
            updateCheckboxSubtasks(index, i);
        }
    } 
}


function updateCheckboxSubtasks(index, i) {
    if (Object.values(currentTasks[index].subtasks.subtasks_todo)[i] == "done") {
        document.getElementById("check_box_" + index + "_btn" + i).classList.add("checked_box");
        document.getElementById("check_box_" + index + "_info" + i).classList.add("task_info_done");
    }
}


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


function stopPropagation(event){
    event.stopPropagation();
}


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


async function changeTaskStatus(index, task, status) {
            await fetch(Base_URL + `/tasks/${index}/subtasks/subtasks_todo/${task}` + ".json",{
                method: "PUT",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(status)
            });
}


async function changeNumberOfFinishedTasks(index, newFinishedTasks) {
            await fetch(Base_URL + `/tasks/${index}/subtasks/number_of_finished_subtasks` + ".json",{
                method: "PUT",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newFinishedTasks)
            });
}


async function deleteTask(index) {
    currentTasks[index] = {};
    await deleteTaskData(`/tasks/${index}`);
    location.reload();
}    


async function deleteTaskData(path = "") {
    await fetch(Base_URL + path + ".json",{
        method: "DELETE",
    });
}


function startTyping() {
    document.getElementById('input_board').classList.add('input_board_searching');
    if (document.getElementById('inputfield_board').value == "") {
        document.getElementById('input_board').classList.remove('input_board_searching');
        updateTaskBoard();
    } else{
        compareTitleWithCurrentTasks(0, document.getElementById('inputfield_board').value);
    }
}


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

function closeAlert() {
    document.getElementById('no_element_found_alert').classList.add('d_none');
    document.getElementById('input_board').classList.remove('alert_input');
}


function showAddTaskOverlay(category) {
    if(category){
        localStorage.setItem("category", category); 
        console.log("Rufe folgende Category auf ",category);
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

