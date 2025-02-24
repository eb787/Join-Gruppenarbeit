let taskArray=[];
let taskContacteArray=[];
let taskSubTaskArray=[];



//Start function
function init(){
    console.log("Starte task");
    loadDataFirebase();
}



function taskReadinArray(taskData){

    console.log("Einträge ",Object.values(taskData).length);
    console.log("Category ",taskData[0].category);
    console.log("deadline ",taskData[0].deadline);


    let contactArray=taskData[0].contacts.map(task=>task);

    console.log("Anzahl der Kontake ",contactArray.length);
     console.log("Kontake ",contactArray);   
     console.log("Kontakt 1" ,contactArray[0])

   } 



function contactReadinArray(){}
