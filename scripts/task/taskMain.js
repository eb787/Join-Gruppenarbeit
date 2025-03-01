let taskArray = [];
let taskContacteArray = [];
let taskSubTaskArray = [];
let taskSubTaskList=[];
let editIndex=false;
let editTaskNr=0;

//Start function
window.onload = function init() {

  startAddTask();
  console.log("Starte task");
  loadDataFirebase();
 // taskRenderContact();
  requiredInputAddTask();
  openDatePicker();
  subTaskListRender();

}

/*Tasten Clear und Create Task sperren*/
function startAddTask() {
  //document.getElementById('btnCreateTask').classList.add('btn_lockout');
  //document.getElementById('btnClearTask').classList.add('btn_lockout');
  document.getElementById('subTaskAddIcon').classList.remove('ele_hide')
  //document.getElementById('subTaskEditIocn').classList.remove('ele_hide')

}


//Felder prüfen ob Eingabe erfolgte mit QuerySelector
function requiredInputAddTask() {
  document.querySelectorAll(".input-field").forEach(input => {
    input.addEventListener("blur", function () {
      let errorMsg = this.nextElementSibling;
      if (this.value.trim() === "") {
        this.classList.add('error_Msg_Input')
        errorMsg.textContent = "This field is required";
        console.log("Keine Eingabe");
      } else {
        if (this.type === "date" && !correctDateInput(this.value)) {
          errorMsg.textContent = "no valid date";
      
        } else {
          console.log("OK Eingabe");
          this.classList.remove('error_Msg_Input')
          errorMsg.textContent = " ";
        }
      }
    })
  })
}


function correctDateInput(dateString) {
  let date = new Date(dateString);
  let year = date.getFullYear();
  // Prüfen, ob das Datum gültig ist
  if (isNaN(year)) {
  }
  // Prüfen, ob die Jahreszahl mehr als 4 Stellen hat
  else if (year.toString().length > 4) {
  }
  // Prüfen, ob das Jahr unter 2025 liegt sollte vielleicht erweiter werden auf aktuelles datum
  else if (year < 2025) {
    return false;
  }
  else {
    console.log("Kein Fehler: Gültige Eingabe");
    return true;
  }
}



//Datum Picker öffnen
function openDatePicker() {
  let dateInput = document.querySelector(".date-input");
  document.querySelector(".date-icon").addEventListener("click", function () {
    if (dateInput.showPicker) {
      dateInput.showPicker();
    } else {
      dateInput.focus();
    }
  });
}


//Prio 
function btnPrioSelect(btnPrio) {
  document.querySelectorAll(".prio_img").forEach(el => {
    el.classList.remove('prio_img_with')
  });
  document.querySelectorAll('.btn_prio').forEach(button => {
    button.style.backgroundColor = "white";
    button.style.color = "black";
  });
  if (btnPrio == "urgent") {
    btnPrioBtnSelect("button-urgent", "#FF3D00", 0)
  }
  if (btnPrio == "medium") {
    btnPrioBtnSelect("button-medium", "#FFA800", 1)
  }
  if (btnPrio == "low") {
    btnPrioBtnSelect("button-low", "#7AE229", 2)
  }
}


function btnPrioBtnSelect(auswahl, btnColor, id) {
  Object.assign(document.getElementsByClassName(auswahl)[0].style, {
    backgroundColor: btnColor,
    color: "white",
  })
  document.getElementsByClassName("prio_img")[id].classList.add('prio_img_with');
}


function subTaskInputCheck(flag) {
  console.log("Input Check");
  let subTaskInput = document.getElementById('inputSubtask')
  if(flag){
    subTaskInput.value=== null;
    console.log("Varianel ".subTaskInput);
    subTaskInput.focus();
    };
  if (subTaskInput) {
    console.log("es wurde was eigeben");
    document.getElementById('subTaskAddIcon').classList.add('ele_hide')
    document.getElementById('subTaskEditIocn').classList.remove('ele_hide')
  } else {
    document.getElementById('subTaskAddIcon').classList.remove('ele_hide')
    document.getElementById('subTaskEditIocn').classList.add('ele_hide')
  }
}


function subTaskClose(){
  console.log("subtask wird geschlossen");
  document.getElementById('subTaskAddIcon').classList.remove('ele_hide')
  document.getElementById('subTaskEditIocn').classList.add('ele_hide')
  document.getElementById('inputSubtask').value="";
}


function taskCreateTask() {
    let element= document.getElementById('inputSubtask');
    contents=element.value;
    element.focus();
    if(editIndex){
     taskSubTaskList[editTaskNr]=contents
     editIndex=false;
     editTaskNr=0;
    }else{
      taskSubTaskList.push(contents);
    }




    
    subTaskClose();
    subTaskListRender();
    console.log("Array ",taskSubTaskList );
}




function editSubTask(index){
  let element= document.getElementById('inputSubtask');
  element.value=taskSubTaskList[index];
  document.getElementById('subTaskAddIcon').classList.add('ele_hide')
  document.getElementById('subTaskEditIocn').classList.remove('ele_hide')
  editTaskNr=index;
  editIndex=true;
 }



function deleteSubTask(index){
  taskSubTaskList.splice(index,1);
  subTaskListRender();
} 



function taskReadinArrayTask(taskData) {
  console.log("Einträge von Task", Object.values(taskData).length);
//  console.log("Category ", taskData[0].category);
 // console.log("deadline ", taskData[0].deadline);
 // let contactArray = taskData[0].contacts.map(task => task);
  //console.log("Anzahl der Kontake ", contactArray.length);
  //console.log("Kontake ", contactArray);
  //console.log("Kontakt 1", contactArray[0])
}


function taskReadinArrayContact(DataContact){
console.log("Adressen")
DataContact.map(task => {
taskContacteArray.push(task);
});


let names = taskContacteArray
  .filter(entry => entry && entry.name) // Entfernt null-Werte & Objekte ohne "name"
  .map(entry => entry.name); // Holt nur die Namen

console.log(names);


} 








function contactReadinArray() {


}













