console.log("daten von firerbase");

const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadDataFirebase() {
try{
   const [responseTask,responseContact] = await Promise.all([
        fetch(Base_URL + "/tasks/" + ".json"),
        fetch(Base_URL + "/contact/" + ".json")
    ])
       const DataTask = await responseTask.json();
    const DatayContact= await responseContact.json();
    taskReadinArray(DataTask);    
}catch(error){
    console.log(error);
}
}


async function saveDataFirebaseTask() {
   
}


async function deleteDataFirebaseTask(params) {
    
}





