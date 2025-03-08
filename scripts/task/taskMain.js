let taskArray = [];
let taskContacteArray = [];
let taskSubTaskArray = [];
let taskSubTaskList=[];
let editIndex=false;
let editTaskNr=0;
let selectedTaskContacts = [];
let taskPrioSelect="medium_prio";
let currentTask = {};
let taskId="";



//Start function
window.onload = function init() {
  startAddTask();
  console.log("Starte task");
  loadDataFirebase();
  requiredInputAddTask();
  focusOnTestFields();
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
      let errorMsg =this.nextElementSibling;
      if (this.value.trim() === "") {
        this.classList.add('error_Msg_Input')
        //errorMsg.style.marginTop = "-4px";      
        errorMsg.textContent = "This field is required";
        console.log("Keine Eingabe");
      } else {
        if (this.type === "date" && !correctDateInput(this.value)) {
          errorMsg.textContent = "no valid date";
          this.classList.add('error_Msg_Input')
        } else {
           console.log("OK Eingabe");
          this.classList.remove('error_Msg_Input')
          errorMsg.textContent = " ";
        }
      }
    })
  })
}


function focusOnTestFields() {
  document.querySelectorAll(".input-field").forEach(event => {
    event.addEventListener("focus", function () {
       document.querySelectorAll(".error_Field").forEach(event => {
        event.textContent="\u00A0";
   
      });
  })});
}


function correctDateInput(dateString) {
  console.log("Datum prüfen ",dateString);
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


function btnPrioSelect(btnPrio) {
  taskPrioSelect="";
  document.querySelectorAll(".prio_img").forEach(el => {
    el.classList.remove('prio_img_with')
  });
  document.querySelectorAll('.btn_prio').forEach(button => {
    button.style.backgroundColor = "white";
    button.style.color = "black";
  });
  if (btnPrio == "urgent") {
    btnPrioBtnSelect("button-urgent", "#FF3D00", 0)
    taskPrioSelect="high_prio";
  }
  if (btnPrio == "medium") {
    btnPrioBtnSelect("button-medium", "#FFA800", 1)
    taskPrioSelect="medium_prio"
  }
  if (btnPrio == "low") {
    btnPrioBtnSelect("button-low", "#7AE229", 2)
    taskPrioSelect="low_prio";
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
   taskId = Object.values(taskData).length;
   console.log("Einträge von Task", Object.values(taskData).length);
   console.log(("TaskID Aktuell" ,taskId));
}


function taskReadinArrayContact(DataContact){
taskContacteArray= Object.values(DataContact)
.flatMap(array=>array.map(entry => (entry.name)))
 
let taskContacColor= Object.values(DataContact)
.flatMap(array=>array.map(entry => (entry.color)))

taskContacteArray.map((name,index)=> 
  taskRenderContactList(name,taskContacColor[index] || "10"));
 } 


function taskContactListDrobdown(){
  document.getElementById('taskContactDrowdownMenue').classList.toggle("ele_show");
}


function taskContactFilterList(){
  let input = document.getElementById("taskDropDownInput").value.toLowerCase();
  let entries = document.querySelectorAll(".contact_Label_Item");
entries.forEach(entries =>{
  let labelText = entries.textContent.toLowerCase();
  if(labelText.includes(input)){
    entries.style.display="flex";
  }else{
    entries.style.display="none";
  }
});
}


function contactCheckOKinArray(){
  selectedTaskContacts = [];
  document.querySelectorAll(".contact_Label_Item").forEach(item=>{
    let checkbox = item.querySelector("input[type='checkbox']")
    if(checkbox && checkbox.checked){
      let name=item.querySelector('span').textContent.trim();
      selectedTaskContacts.push(name);
    }
  })
  console.log("Namen mit Checkbox ",selectedTaskContacts);
}


function checkInputData(){
      let mandatoryFields = document.querySelectorAll('.input-field');
       mandatoryFields.forEach(field => {
        if (field.value.trim() === "") {
            field.classList.add('error_Msg_Input');
            console.log("Es fehlt noch was");
        } else {
            field.classList.remove('error_Msg_Input');
            console.log("Alle Daten OK");
            pushTaskToServer();
        }
    });
}


function  collectData(){
currentTask = {
  title: document.getElementById('taskTitle').value,
  description: document.getElementById('descriptionTask').value.trim() || "empty",  // oder "empty" reinschreiben wenn es leer bleibt
  contacts: selectedTaskContacts, // oder 0 reinschreiben ohne array wenn keine Kontakte hinzugefügt werden
  deadline: dateConversion(document.getElementById('taskDate').value),
  prio: taskPrioSelect, // "medium_prio" , oder "low_prio", oder "high_prio"
  category: taskCatergoryRetrieve(document.getElementById('taskCatergory').value), // "Technical Task" oder "User Story"
  subtasks: {
      total: taskSubTaskList.length, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
      number_of_finished_subtasks: 0, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
      subtasks_todo: subTasksObjects(),
   },
  status: "toDo" //  "toDo",  "inProgress", "awaitFeedback", oder "done" 
}
}


function dateConversion(date){
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}


function taskCatergoryRetrieve(number){
  if(number === "1"){
    return "Technical Task";
  }else{
    return "User Story"
  }
}


function subTasksObjects(){
let  todoSatus = "todo"; 
let subTasksTodo = {}; 
taskSubTaskList.forEach(task => {
    subTasksTodo[task] = todoSatus; 
});
return subTasksTodo;
}




function addTaskClear(){
  
}


