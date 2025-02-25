const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

let currentTasks = [];
let currentTask = {};
let taskId = "";

async function loadTaskData() {
    let TaskResponse = await fetch(Base_URL + "/tasks/" + ".json");
    TaskResponseToJson = await TaskResponse.json();

   for (let index = 0; index < Object.values(TaskResponseToJson).length; index++) {
        currentTasks.push(Object.values(TaskResponseToJson)[index]);
   }    

   taskId = Object.values(TaskResponseToJson).length;
   updateTaskBoard();
}

function updateTaskBoard() {
    //hier geben wir die Daten in ein Template dass dan als task-card im Board angezeigt wird
}

function pushTaskToServer() {
    getTaskInfoFromUser();
    postTaskData(`/tasks/${taskId}`, currentTask);
}


// Hier dann bitte Infos reinspeichern
function getTaskInfoFromUser() { 
    currentTask = {
        title: "Hier speichern wir den Titel rein",
        description: "Hie speichern wir die Erklärung über den Task rein",
        contacts: ["Das ist", "ein Array", "das alle Kontakte enthält", "die an dem Task mitarbeiten"],
        deadline: "Das ist das Deadline-Datum",
        prio: "medium",
        category: "Technica Task",
        subtasks: ["Das ist die Liste", "an Subtasks die zu erledigen sind"],
    }
}

async function postTaskData(path = "", task) {

    let CurrentTaskResponse = await fetch(Base_URL + path + ".json",{
        method: "PUT",
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

function moveTo(category) {
    document.getElementById(category).innerHTML += chooseRightCard("User Story");
}

function chooseRightCard(cardType) {
    if (cardType == "User Story"){
       return getUserStoryCard();
    }
}