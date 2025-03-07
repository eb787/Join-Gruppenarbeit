const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

let currentTasks = [];
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

   for (let index = 0; index < Object.values(TaskResponseToJson).length; index++) {
        currentTasks.push(Object.values(TaskResponseToJson)[index]);
   }    

   taskId = Object.values(TaskResponseToJson).length; 
}

function updateTaskBoard() {
    //hier geben wir die Daten in ein Template dass dan als task-card im Board angezeigt wird
    emptyBoard();

    for (let index = 0; index < currentTasks.length; index++) {
        showCardOnBoard(index);


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
   
    if (currentTasks[index].status == "toDo") {
        document.getElementById("no_task_toDo").classList.add("d_none");
        document.getElementById("toDo").innerHTML += getExampleCard(index);
    }


    if (currentTasks[index].status == "inProgress") {
        document.getElementById("no_task_inProgress").classList.add("d_none");
        document.getElementById("inProgress").innerHTML += getExampleCard(index);
    }

    if (currentTasks[index].status == "awaitFeedback") {
        document.getElementById("no_task_awaitFeedback").classList.add("d_none");
        document.getElementById("awaitFeedback").innerHTML += getExampleCard(index);
    }

    if (currentTasks[index].status == "done") {
        document.getElementById("no_task_done").classList.add("d_none");
        document.getElementById("done").innerHTML += getExampleCard(index);
    }

    if (currentTasks[index].category == "User Story") {
        document.getElementById("category_" + index).classList.add("user_story");
        document.getElementById("category_" + index).classList.remove("technical_task");
    }
  
     if (subtasks != 0) {
        document.getElementById("subtasks_box" + index).innerHTML = getSubtasks(index, subtasks, progress);
    } 

    if (currentTasks[index].description == "empty") {
        document.getElementById("description_" + index).classList.add("d_none");
    }

    if (currentTasks[index].contacts != 0) {
         document.getElementById("Profile_badges_" + index).innerHTML += getContactIcon();
    } else {
       document.getElementById("Profile_badges_" + index).classList.add("d_none");
    }
}

function pushTaskToServer() {
    getTaskInfoFromUser();
    postTaskData(`/tasks/${taskId}`, currentTask);
}


// Hier dann bitte Infos reinspeichern
function getTaskInfoFromUser() { 
    currentTask = {
        title: "Die Wand streichen",
        description: "Die Wand im Wohnzimmer grün streichen", // oder "empty" reinschreiben wenn es leer bleibt
        contacts: ["Jasmin", "Peter"], // oder 0 reinschreiben ohne array wenn keine Kontakte hinzugefügt werden
        deadline: "03.03.2025",
        prio: "low_prio", // "medium_prio" , oder "low_prio", oder "high_prio"
        category: "User Story", // "Technical Task" oder "User Story"
        subtasks: {
            total: 3, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
            number_of_finished_subtasks: 0, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
            subtasks_todo: {
                "Die Wand abkleben": "todo",
                "Farbe auftragen": "todo",
                "Pinsel und Zimmer putzen": "todo"
            }
        },
        status: "toDo" //  "toDo",  "inProgress", "awaitFeedback", oder "done" 
    }
}

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

async function postTaskData(path = "", task) {
    let CurrentTaskResponse = await fetch(Base_URL + path + ".json",{
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task)
    });

    return CurrentTaskResponseToJson = await CurrentTaskResponse.json();
}

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

    document.getElementById("card_overlay").innerHTML = getCardOverlayContent(index);
    if (currentTasks[index].category == "User Story") {
        document.getElementById("category_overlay" + index).classList.add("user_story_overlay");
        document.getElementById("category_overlay" + index).classList.remove("technical_task_overlay");
    } else if (currentTasks[index].category == "Technical Task") {
        document.getElementById("category_overlay" + index).classList.remove("user_story_overlay");
        document.getElementById("category_overlay" + index).classList.add("technical_task_overlay");
    }

    if (currentTasks[index].subtasks.total != 0) {
        document.getElementById("subtasks_box_overlay" + index).innerHTML = getSubtasksOverlay(index);
        for (let i = 0; i < currentTasks[index].subtasks.total; i++) {
            document.getElementById("tasks_box" + index).innerHTML += getTaskOverlay(index, i);
            if (Object.values(currentTasks[index].subtasks.subtasks_todo)[i] == "done") {
                document.getElementById("check_box_" + index + "_btn" + i).classList.add("checked_box");
            
            }
            
        }

        
        
    } 
    
}

function closeOverlay() {
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

