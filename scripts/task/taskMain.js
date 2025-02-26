let taskArray=[];
let taskContacteArray=[];
let taskSubTaskArray=[];



//Start function
window.onload= function init(){
   
  startAddTask();
    console.log("Starte task");
    loadDataFirebase();
    // taskRenderContact();

}

/*Tasten Clear und Create Task sperren*/ 
function startAddTask(){
  document.getElementById('btnCreateTask').classList.add('btn_lockout');
  document.getElementById('btnClearTask').classList.add('btn_lockout');
}



//Felder prüfen ob Eingabe erfolgte
function  requiredInputAddTask(){


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



function contactReadinArray(id,idMsg){

let  input = document.getElementById(id);
let  taskErrorMsg= document.getElementById(idMsg) 

input.addEventListener("blur",function(){

if(input.value.trim()===""){
  

}else{

}


});


}










