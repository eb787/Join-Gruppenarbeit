const Base_URLTask = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 *Function retrieves the data Task and Contacts on the FirebaseDB
 */
async function loadDataFirebase() {
    try {
        const [responseTask, responseContact] = await Promise.all([
            fetch(Base_URLTask + "/tasks/" + ".json"),
            fetch(Base_URLTask + "/contacts/" + ".json")
        ])
            const DataTask = await responseTask.json();
            const DataContact = await responseContact.json();                   
            taskReadinArrayTask(DataTask);
            taskReadinArrayContact(DataContact);        
    } catch (error) {
        console.log("Fehler beim lesen ", error);
    }
}


/**
 * Function writes the data from a task into the FirebaseDB when creating a new task
 */
function pushTaskToServer() {
    collectData();
    postTaskData(`/tasks/${taskId}`, currentTaskAdd);
}


/**
 * Function writes the data from a task to the FirebaseDB when a task changes
 * @param {String} path the corresponding path with ID
 * @param {String} task  the changed task
 */
async function postTaskData(path = "", task) {
    let CurrentTaskResponse = await fetch(Base_URLTask + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task)
       });    
    }
