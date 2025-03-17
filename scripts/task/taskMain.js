let taskArray = [];
let taskContacteArray = [];
let taskSubTaskArray = [];
let taskSubTaskList = [];
let editIndex = false;
let editTaskNr = 0;
let selectedTaskContacts = [];
let taskPrioSelect = "medium_prio";
//let currentTask = {};
//let taskId = "";



//Start function
//window.onload = function init() {
function init(){  

  startAddTask();
  loadDataFirebase();
  requiredInputAddTask();
  focusOnRequiredFields();
   subTaskListRender();
}




//Tasten Clear und Create Task sperren*/
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
          this.classList.add('error_Msg_Input')
        } else {
          console.log("OK Eingabe");
          this.classList.remove('error_Msg_Input')
          errorMsg.textContent = "\u00A0";
        }
      }
    })
  })
}


function focusOnRequiredFields() {
  document.querySelectorAll(".input-field").forEach(event => {
    event.addEventListener("focus", function () {
      document.querySelectorAll(".error_Field").forEach(event => {
        event.textContent = "\u00A0";
      });
    })
  });
}



function correctDateInput(dateString) {
  console.log("Datum prüfen ", dateString);
  let date = new Date(dateString);
  let year = date.getFullYear();
  console.log("Jahr auisgeben", year);

  if (year.toString().length > 4) {
  }
  else if (year < 2025) {
    return false;
  }
  else {
    return true;
  }
}

//Datum Picker öffnen
function openDatePicker() {
  let dateInput=document.getElementById('taskDate');
     if (dateInput.showPicker) {
      dateInput.showPicker();
      document.getElementById('taskDate').focus();
    } else {
      dateInput.focus();
    }
 }


function btnPrioSelect(btnPrio) {
  taskPrioSelect = "";
  document.querySelectorAll(".prio_img").forEach(el => {
    el.classList.remove('prio_img_with')
  });
  document.querySelectorAll('.btn_prio').forEach(button => {
    button.style.backgroundColor = "white";
    button.style.color = "black";
  });
  if (btnPrio == "urgent") {
    btnPrioBtnSelect("button-urgent", "#FF3D00", 0)
    taskPrioSelect = "high_prio";
  }
  if (btnPrio == "medium") {
    btnPrioBtnSelect("button-medium", "#FFA800", 1)
    taskPrioSelect = "medium_prio"
  }
  if (btnPrio == "low") {
    btnPrioBtnSelect("button-low", "#7AE229", 2)
    taskPrioSelect = "low_prio";
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
  if (flag) {
    subTaskInput.value === null;
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


function subTaskClose() {
  console.log("subtask wird geschlossen");
  document.getElementById('subTaskAddIcon').classList.remove('ele_hide')
  document.getElementById('subTaskEditIocn').classList.add('ele_hide')
  document.getElementById('inputSubtask').value = "";
}


function taskCreateTask() {
  let element = document.getElementById('inputSubtask');
  contents = element.value;
  element.focus();
  if (editIndex) {
    taskSubTaskList[editTaskNr] = contents
    editIndex = false;
    editTaskNr = 0;
  } else {
    taskSubTaskList.push(contents);
  }
  subTaskClose();
  subTaskListRender();
  console.log("Array ", taskSubTaskList);
}


function editSubTask(index) {
  let element = document.getElementById('inputSubtask');
  element.value = taskSubTaskList[index];
  document.getElementById('subTaskAddIcon').classList.add('ele_hide')
  document.getElementById('subTaskEditIocn').classList.remove('ele_hide')
  editTaskNr = index;
  editIndex = true;
}


function deleteSubTask(index) {
  taskSubTaskList.splice(index, 1);
  subTaskListRender();
}


function taskReadinArrayTask(taskData) {
  taskId = Object.values(taskData).length;
}



function taskReadinArrayContact(DataContact) {
  console.log("Aushabe Datacontact ",DataContact);
  let= index=0;
  document.getElementById('taskDropDownList').innerHTML="";
  taskContacteArray = Object.values(DataContact)
  .flatMap(array=>array.map(entry=>({
    name:entry.name,
    email:entry.email,
    color: entry.color || "10"
  })));
  console.log("Array mit name,Maikl ",taskContacteArray);
  taskContacteArray.map((contact,index) =>{
      taskRenderContactList(index,contact.name,contact.color ||  "10",contact.email);
      });
   }



function taskContactListDrobdown() {
  document.getElementById('taskContactDrowdownMenue').classList.toggle('ele_show');
  document.getElementById('initialeIconList').classList.toggle('icon_List_hide')
}


function taskContactFilterList() {
  let input = document.getElementById("taskDropDownInput").value.toLowerCase();
  let entries = document.querySelectorAll(".contact_Label_Item");
  entries.forEach(entries => {
    let labelText = entries.textContent.toLowerCase();
    if (labelText.includes(input)) {
      entries.style.display = "flex";
    } else {
      entries.style.display = "none";
    }
  });
}

function contactCheckOKinArray(index) {
  selectedTaskContacts = [];
  document.querySelectorAll(".contact_Label_Item").forEach((entry,contactID) => {
    let checkbox = entry.querySelector("input[type='checkbox']")
    if (checkbox && checkbox.checked) {
      console.log("ID ",contactID)
      selectedTaskContacts.push(taskContacteArray[contactID]);
      document.getElementById('initialeIconList').innerHTML="";
      taskContacInitialRender(selectedTaskContacts);
     }
  })
  console.log("Namen mit Checkbox ", selectedTaskContacts);
}

function checkInputData() {
  let mandatoryFields = document.querySelectorAll('.input-field');
     mandatoryFields.forEach(field => {
    if (field.value.trim() == "") {
       field.classList.add('error_Msg_Input');
        console.log("Es fehlt noch was");
        return;
    } else {
      
     // field.classList.remove('error_Msg_Input');
      console.log("Alle Daten OK");
      pushTaskToServer();
      timePopUp(2000);
      addTaskClear();
    }
  });
     
  
}

 function timePopUp(duration){
  let notification = document.getElementById('notificationFinish');
  notification.style.display="flex";
    setTimeout(()=>{
    notification.style.display="none";
  },duration);
}


function collectData() {
  currentTask = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('descriptionTask').value.trim() || "empty",  // oder "empty" reinschreiben wenn es leer bleibt
    contacts: selectedTaskContacts, //
      deadline: dateConversion(document.getElementById('taskDate').value),
    prio: taskPrioSelect, // "medium_prio" , oder "low_prio", oder "hgh_prioi"
    category: taskCatergoryRetrieve(document.getElementById('taskCatergory').value), // "Technical Task" oder "User Story"
    subtasks: {
      total: taskSubTaskList.length, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
      number_of_finished_subtasks: 0, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
      subtasks_todo: subTasksObjects(),
    },
    status: "toDo" //  "toDo",  "inProgress", "awaitFeedback", oder "done" 
  }
}


function dateConversion(dateOld) {
  let date = new Date(dateOld);
  let day = String(date.getDate()).padStart(2, '0'); // 25
  let month = String(date.getMonth() + 1).padStart(2, '0'); // 02
  let year = String(date.getFullYear()).slice(-2); // 25 (letzte 2 Stellen)
  return `${day}/${month}/${year}`;
}


function taskCatergoryRetrieve(number) {
  if (number === "1") {
    return "Technical Task";
  } else {
    return "User Story"
  }
}


function subTasksObjects() {
  let todoSatus = "todo";
  let subTasksTodo = {};
  taskSubTaskList.forEach(task => {
    subTasksTodo[task] = todoSatus;
  });
  return subTasksTodo;
}


function addTaskClear() {
  console.log("Lösche Felder");
  document.getElementById('taskTitle').value = "";
  document.getElementById('descriptionTask').value = "";
  loadDataFirebase();

  document.getElementById('taskContactDrowdownMenue').classList.remove("ele_show");
  selectedTaskContacts = [];
  document.getElementById('initialeIconList').innerHTML="";
  document.getElementById('taskDate').value = "";
  btnPrioSelect('medium');
  document.getElementById('taskCatergory').value = "";
  document.getElementById('inputSubtask').value = "";
 
  subTaskClose();
  taskSubTaskList = [];
  subTaskClose();
  subTaskListRender();
  document.getElementById('taskTitle').focus();
  
  //document.getElementById('taskTitle').style.borderColor="black";
 // document.getElementById('taskDate').style.borderColor="black";
 // document.getElementById('taskCatergory').style.borderColor="black";


}


function Test(){
  console.log("setze Button zurück");
  //document.getElementById('taskDate').style.setProperty("border-color", "black", "important");

document.getElementById('taskDate').style.borderColor="";
}

