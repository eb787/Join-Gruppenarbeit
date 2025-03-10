console.log("daten von firerbase");

const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadDataFirebase() {
try{
   const [responseTask,responseContact] = await Promise.all([
        fetch(Base_URL + "/tasks/" + ".json"),
        fetch(Base_URL + "/contacts/" + ".json")
    ])
       const DataTask = await responseTask.json();
       const DataContact= await responseContact.json();
   taskReadinArrayTask(DataTask);   
   taskReadinArrayContact(DataContact); 
    
}catch(error){
    console.log("Fehler beim lesen " ,error);
}
}


function taskReadinArrayContact(DataContact) {
    taskContacteArray = Object.values(DataContact)
      .flatMap(array => array.map(entry => (entry.name)))
    let taskContacColor = Object.values(DataContact)
      .flatMap(array => array.map(entry => (entry.color)))
  
      let taskContacEMailArray=Object.values(DataContact)
      .flatMap(array=>array.map(entry=>(entry.email)))
    
      taskContacteArray.map((name, index) =>
      taskRenderContactList(name, taskContacColor[index] || "10"));
  }


function pushTaskToServer() {
    collectData();
    loadDataFirebase();
    postTaskData(`/tasks/${taskId}`, currentTask);
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





