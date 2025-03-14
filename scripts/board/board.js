const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

const contactColorArray = {
    1: "#1FD7C1",
    2: "#462F8A",
    3: "#FC71FF",
    4: "#6E52FF",
    5: "#9327FF",
    6: "#FFBB2B",
    7: "#FF4646",
    8: "#00BEE8",
    9: "#FF7A00"
};

let currentTasks = {};
let currentTask = {};
let taskId = "";
let elementToBeDropped = "";
let newFinishedTasks = 0;


async function loadTaskData() {
    await fetchTaskData();
    updateTaskBoard();
    document.getElementById("full_content").innerHTML += getCardOverlay(); 
}

async function fetchTaskData(){
    currentTasks = [];
    let TaskResponse = await fetch(Base_URL + "/tasks/" + ".json");
    TaskResponseToJson = await TaskResponse.json();

//    for (let index = 0; index < Object.values(TaskResponseToJson).length; index++) {
//         if (Object.values(TaskResponseToJson)[index]) {
//           currentTasks.push(Object.values(TaskResponseToJson)[index]);  
//         }
//    }    

for (let index = 0; index < TaskResponseToJson.length; index++) {
    if (TaskResponseToJson[index]) {
       
      currentTasks[index] = TaskResponseToJson[index];
    }
}  

   taskId = Object.values(TaskResponseToJson).length; 
}



function updateTaskBoard() {
    //hier geben wir die Daten in ein Template dass dan als task-card im Board angezeigt wird
    emptyBoard();

    // for (let index = 0; index < currentTasks.length; index++) {
    //     showCardOnBoard(index);
    // }

    for (let index = 0; index < currentTasks.length; index++) {
        if (currentTasks[index]) {
        showCardOnBoard(index);

        }
        
    }
}

function emptyBoard() {
    document.getElementById("toDo").innerHTML = getNoTasksToDoCard();
    document.getElementById("inProgress").innerHTML = getNoTasksInProgressCard();
    document.getElementById("awaitFeedback").innerHTML = getNoTasksAwaitFeedbackCard();
    document.getElementById("done").innerHTML = getNoTasksDoneCard();
}

function showCardOnBoard(index) {
    let subtasks = currentTasks[index].subtasks.total;
    let progress =  currentTasks[index].subtasks.number_of_finished_subtasks / subtasks * 100;
    let layer = "";
    if (currentTasks[index].status == "toDo") {
        document.getElementById("no_task_toDo").classList.add("d_none");
        document.getElementById("toDo").innerHTML += getExampleCard(index, layer);
    }


    if (currentTasks[index].status == "inProgress") {
        document.getElementById("no_task_inProgress").classList.add("d_none");
        document.getElementById("inProgress").innerHTML += getExampleCard(index, layer);
    }

    if (currentTasks[index].status == "awaitFeedback") {
        document.getElementById("no_task_awaitFeedback").classList.add("d_none");
        document.getElementById("awaitFeedback").innerHTML += getExampleCard(index, layer);
    }

    if (currentTasks[index].status == "done") {
        document.getElementById("no_task_done").classList.add("d_none");
        document.getElementById("done").innerHTML += getExampleCard(index, layer);
    }


    checkCategory(index, layer);


    checkSubtasks(subtasks, index, progress, layer);

    checkDescription(index, layer);
    checkContacts(index, layer);
  
    

    

   
}

function checkCategory(index, layer){
    if (currentTasks[index].category == "User Story") {
        document.getElementById("category_" + index + "_" + layer).classList.add("user_story");
        document.getElementById("category_" + index + "_" + layer).classList.remove("technical_task");
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

function checkContacts(index, layer) {
    if (currentTasks[index].contacts) {
        for (let i = 0; i < currentTasks[index].contacts.length; i++) {
            getCorrectContact(index, i, layer);
            
        }
         
    } else {
       document.getElementById("Profile_badges_" + index + "_" + layer).innerHTML = "";
    }
}

function getCorrectContact(index, i, layer) {
        document.getElementById("Profile_badges_" + index + "_" + layer).innerHTML += getContactIcon(index, i, layer);
        getInitials(index, i, layer);
}

function getInitials(index, i, layer) {
    let names = currentTasks[index].contacts[i].name.split(' ');
    let initials = "";
    for (let a = 0; a < names.length; a++) {
        initials += names[a].substr(0,1);
        
    }
    document.getElementById("profile_" + index + "_" + i + "_" + layer).innerHTML += initials.toUpperCase();
    
}


// function pushTaskToServer() {
//     getTaskInfoFromUser();
//     postTaskData(`/tasks/${0}`, currentTask);
// }


// Hier dann bitte Infos reinspeichern
// function getTaskInfoFromUser() { 
//     currentTask = {
//         title: "Die Wand streichen",
//         description: "Die Wand im Wohnzimmer grün streichen", // oder "empty" reinschreiben wenn es leer bleibt
//         contacts: ["Jasmin", "Peter"], // oder 0 reinschreiben ohne array wenn keine Kontakte hinzugefügt werden
//         deadline: "03.03.2025",
//         prio: "low_prio", // "medium_prio" , oder "low_prio", oder "high_prio"
//         category: "User Story", // "Technical Task" oder "User Story"
//         subtasks: {
//             total: 3, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
//             number_of_finished_subtasks: 0, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
//             subtasks_todo: {
//                 "Die Wand abkleben": "todo",
//                 "Farbe auftragen": "todo",
//                 "Pinsel und Zimmer putzen": "todo"
//             }
//         },
//         status: "toDo" //  "toDo",  "inProgress", "awaitFeedback", oder "done" 
//     }
// }

// // Hier dann bitte Infos reinspeichern
// function getTaskInfoFromUser() { 
//     currentTask = {
//         title: "Hier speichern wir den Titel rein",
//         description: "Hier speichern wir die Erklärung über den Task rein", // oder "empty" reinschreiben wenn es leer bleibt
//         contacts: ["Das ist", "ein Array", "das alle Kontakte enthält", "die an dem Task mitarbeiten"], // oder 0 reinschreiben ohne array wenn keine Kontakte hinzugefügt werden
//         deadline: "Das ist das Deadline-Datum",
//         prio: "medium_prio", // "medium_prio" , oder "low_prio", oder "high_prio"
//         category: "Technical Task", // "Technical Task" oder "User Story"
//         subtasks: {
//             total: 8, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
//             number_of_finished_subtasks: 2, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
//             subtasks_todo: ["Das ist die Liste", "an Subtasks die noch zu erledigen sind"],
//             subtasks_done: ["Das ist die Liste", "an Subtasks die schon erledigt wurden"], // ist am Anfang leer
//         },
//         status: "toDo" //  "toDo",  "inProgress", "awaitFeedback", oder "done" 
//     }
// }

// async function postTaskData(path = "", task) {
//     let CurrentTaskResponse = await fetch(Base_URL + path + ".json",{
//         method: "POST",
//         header: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(task)
//     });

//     return CurrentTaskResponseToJson = await CurrentTaskResponse.json();
// }

//!!!!Eine Delete-Funktion muss dann immer die Reihenfolge beachten also man muss dannn quasi alle Tasks noch mal neu auf den Server überschreiben, damit die nicht durcheinander geraten!!!!

function allowDrop(event) {
    event.preventDefault();
}

function startDragging(index) {
    elementToBeDropped = index;
}

async function moveTo(category) {
    currentTasks[elementToBeDropped].status = category;
    currentTask = currentTasks[elementToBeDropped];
    await changeCategory(`/tasks/${elementToBeDropped}`, currentTask);
    // showCardOnBoard(elementToBeDropped);
    loadTaskData();

    // document.getElementById(category).innerHTML += getExampleCard(elementToBeDropped, 2, 20);
}

async function changeCategory(path = "", newObj) {
    let CurrentCategoryResponse = await fetch(Base_URL + path + ".json",{
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newObj)
    });

    return CurrentCategoryResponseToJson = await CurrentCategoryResponse.json();
}

function chooseRightCard(cardType) {
    if (cardType == "User Story"){
       return getUserStoryCard();
    }
}

function showCardOverlay(index) {
    
    document.getElementById("bg_overlay").classList.remove("d_none");
    document.getElementById('card_overlay').classList.remove('card_extra');

    document.getElementById("card_overlay").innerHTML = getCardOverlayContent(index);
    if (currentTasks[index].category == "User Story") {
        document.getElementById("category_overlay" + index).classList.add("user_story_overlay");
        document.getElementById("category_overlay" + index).classList.remove("technical_task_overlay");
    } else if (currentTasks[index].category == "Technical Task") {
        document.getElementById("category_overlay" + index).classList.remove("user_story_overlay");
        document.getElementById("category_overlay" + index).classList.add("technical_task_overlay");
    }
    checkPriority(index);


    if (currentTasks[index].subtasks.total != 0) {
        document.getElementById("subtasks_box_overlay" + index).innerHTML = getSubtasksOverlay(index);
        for (let i = 0; i < currentTasks[index].subtasks.total; i++) {
            document.getElementById("tasks_box" + index).innerHTML += getTaskOverlay(index, i);
            if (Object.values(currentTasks[index].subtasks.subtasks_todo)[i] == "done") {
                document.getElementById("check_box_" + index + "_btn" + i).classList.add("checked_box");
           
            }
            
        }

        
        
    } 

    if (currentTasks[index].contacts) {
        document.getElementById("task_description_overlay_" + index).innerHTML = getContactBoxOverlay(index);

        for (let i = 0; i < currentTasks[index].contacts.length; i++) {
            document.getElementById("profile_badges_overlay" + index).innerHTML += getContactIconOverlay(index, i);
            getInitialsOverlay(index, i);
           
        }
    }
}


function getInitialsOverlay(index, i) {
    let names = currentTasks[index].contacts[i].name.split(' ');
    let initials = "";
    for (let a = 0; a < names.length; a++) {
        initials += names[a].substr(0,1);
    }
    document.getElementById("profile_badge_overlay_" + index + "_" + i).innerHTML += initials.toUpperCase();
}

function closeOverlay() {
    document.getElementById('card_overlay').innerHTML = "";
    document.getElementById("bg_overlay").classList.add("d_none");
}

function stopPropagation(event){
    event.stopPropagation();
}

async function changeSubtaskCategory(index, i){
    let div =  document.getElementById("check_box_" + index + "_btn" + i);
    let task = Object.keys(currentTasks[index].subtasks.subtasks_todo)[i];
    newFinishedTasks = currentTasks[index].subtasks.number_of_finished_subtasks;
    div.classList.toggle("checked_box");

    if (div.classList.contains("checked_box")) {
        await changeTaskStatus(index, task, "done");
        newFinishedTasks = newFinishedTasks + 1;
        await changeNumberOfFinishedTasks(index, newFinishedTasks);
    }

    if (div.classList.contains("checked_box") == false) {
        await changeTaskStatus(index, task, "todo");
        newFinishedTasks = newFinishedTasks - 1;
        await changeNumberOfFinishedTasks(index, newFinishedTasks);
        }

        await fetchTaskData();
}

async function changeTaskStatus(index, task, status) {
   
            let CurrentSubtaskResponse = await fetch(Base_URL + `/tasks/${index}/subtasks/subtasks_todo/${task}` + ".json",{
                method: "PUT",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(status)
            });
        
            return CurrentSubtaskResponseToJson = await CurrentSubtaskResponse.json();
}

async function changeNumberOfFinishedTasks(index, newFinishedTasks) {

    
            let CurrentFinishedTasksResponse = await fetch(Base_URL + `/tasks/${index}/subtasks/number_of_finished_subtasks` + ".json",{
                method: "PUT",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newFinishedTasks)
            });
        
            return CurrentFinishedTasksResponseToJson = await CurrentFinishedTasksResponse.json();
    }


async function deleteTask(index) {

    currentTasks.splice(index, 1);
    updateFirebase();

}    

async function updateFirebase() {
    for (let index = 0; index < currentTasks.length; index++) {
        await postTaskData(`/tasks/${index}`, currentTasks[index]);
    }
    await deleteTaskData(`/tasks/${currentTasks.length}`);
    location.reload();
}

async function postTaskData(path = "", task) {
    let CurrentTaskResponse = await fetch(Base_URL + path + ".json",{
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task)
    });
 }

 async function deleteTaskData(path = "") {
    let CurrentTaskResponse = await fetch(Base_URL + path + ".json",{
        method: "DELETE",
    });
 }

function findTask() {
    let titleToFind = document.getElementById('inputfield_board').value;
    document.getElementById("bg_overlay").classList.remove("d_none");
    document.getElementById('card_overlay').innerHTML = getFoundItems();
    document.getElementById('card_overlay').classList.add('card_extra');
    for (let index = 0; index < currentTasks.length; index++) {
        if (currentTasks[index]) {
            getTaskInfo(index, titleToFind);
        }
        
    } 

    if (document.getElementById('found_titles').innerHTML == '') {
        closeOverlay();
        document.getElementById('card_overlay').classList.remove('card_extra');
        document.getElementById('no_element_found_alert').classList.remove('d_none');
        document.getElementById('input_board').classList.add('alert_input');
        setTimeout(() => {
       document.getElementById('no_element_found_alert').classList.add('d_none');
        document.getElementById('input_board').classList.remove('alert_input');
          }, 5000);
        
    }
    document.getElementById('inputfield_board').value = "";
}

function getTaskInfo(index, titleToFind) {
    if (currentTasks[index].title.toLowerCase().includes(titleToFind.toLowerCase())) {
        let subtasks = currentTasks[index].subtasks.total;
        let progress =  currentTasks[index].subtasks.number_of_finished_subtasks / subtasks * 100;
        let layer = "overlay";
        document.getElementById('found_titles').innerHTML += getExampleCard(index, layer);

        checkCategory(index, layer);
        checkSubtasks(subtasks, index, progress, layer);
        checkDescription(index, layer);
        checkContacts(index, layer);
    }
}

