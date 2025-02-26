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
    //   pushTaskToServer()
   updateTaskBoard();

 
   
}

function updateTaskBoard() {
    //hier geben wir die Daten in ein Template dass dan als task-card im Board angezeigt wird
  

    for (let index = 0; index < currentTasks.length; index++) {

        let subtasks = currentTasks[index].subtasks.total;
        let progress =  currentTasks[index].subtasks.number_of_finished_subtasks / subtasks * 100;
       
        if (currentTasks[index].status == "toDo") {
            document.getElementById("no_task_toDo").classList.add("d_none");
            document.getElementById("toDo").innerHTML += getExampleCard(index, subtasks, progress);
        }


        if (currentTasks[index].status == "inProgress") {
            document.getElementById("no_task_inProgress").classList.add("d_none");
            document.getElementById("inProgress").innerHTML += getExampleCard(index, subtasks, progress);
        }

        if (currentTasks[index].status == "awaitFeedback") {
            document.getElementById("no_task_awaitFeedback").classList.add("d_none");
            document.getElementById("awaitFeedback").innerHTML += getExampleCard(index, subtasks, progress);
        }

        if (currentTasks[index].status == "done") {
            document.getElementById("no_task_done").classList.add("d_none");
            document.getElementById("done").innerHTML += getExampleCard(index, subtasks, progress);
        }

        if (currentTasks[index].category == "User Story") {
            document.getElementById("category_" + index).classList.add("user_story");
            document.getElementById("category_" + index).classList.remove("technical_task");
        }
      
         if (subtasks == 0) {
            document.getElementById("subtasks_" + index).classList.add("d_none");
        } 

        if (currentTasks[index].description == "empty") {
            document.getElementById("description_" + index).classList.add("d_none");
        }

        if (currentTasks[index].contacts == 0) {
            document.getElementById("Profile_badges_" + index).classList.add("d_none");
        } else {
            document.getElementById("Profile_badges_" + index).innerHTML += getContactIcon();
        }

    }

}

function pushTaskToServer() {
    getTaskInfoFromUser();
    postTaskData(`/tasks/${taskId}`, currentTask);
}


// Hier dann bitte Infos reinspeichern
function getTaskInfoFromUser() { 
    currentTask = {
        title: "Hier speichern wir den Titel rein",
        description: "Hier speichern wir die Erklärung über den Task rein", // oder "empty" reinschreiben wenn es leer bleibt
        contacts: ["Das ist", "ein Array", "das alle Kontakte enthält", "die an dem Task mitarbeiten"], // oder 0 reinschreiben ohne array wenn keine Kontakte hinzugefügt werden
        deadline: "Das ist das Deadline-Datum",
        prio: "medium_prio", // "medium_prio" , oder "low_prio", oder "high_prio"
        category: "Technical Task", // "Technical Task" oder "User Story"
        subtasks: {
            total: 8, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
            number_of_finished_subtasks: 2, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
            subtasks_todo: ["Das ist die Liste", "an Subtasks die noch zu erledigen sind"],
            subtasks_done: ["Das ist die Liste", "an Subtasks die schon erledigt wurden"], // ist am Anfang leer
        },
        status: "toDo" //  "toDo",  "inProgress", "awaitFeedback", oder "done" 
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