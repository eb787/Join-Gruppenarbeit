let taskArray = [];
let taskContacteArray = [];
let taskSubTaskArray = [];
let taskSubTaskList = [];
let editIndex = false;
let editTaskNr = 0;
let selectedTaskContacts = [];
let taskPrioSelect = "medium_prio";
let currentTaskAdd = {};
let inputsOK=[false,false,false];
taskContacteArray

window.onresize = showHelpIconMobile;

function init() {
  startAddTask();
  loadDataFirebase();
  checkAllRequiredData();
  subTaskListRender();
  showHelpIconMobile()
}


function startAddTask() {
  document.getElementById('subTaskAddIcon').classList.remove('ele_hide')
}

/**
 * This function logs out the user by removing the 'userLoggedIn' flag from localStorage
 * and resetting the greetingShown flag.
 */
function logout() {
  localStorage.removeItem('userLoggedIn');
  localStorage.setItem('greetingShown', 'false');
}


/**
 * This function shows the help icon on mobile screens (below 1000px width).
 */
function showHelpIconMobile() {
  let helpLink = document.getElementById("mobile_help_link");
  if (window.innerWidth <= 1000) {
    helpLink.style.display = "flex"; 
  } else {
    helpLink.style.display = "none"; 
  }
}



function requiredInputTitle(){
let entry = document.getElementById('taskTitle').value;

if (entry.trim() ===""){
  document.getElementById('taskTitle').classList.add('error_Input');
  inputsOK[0]=false;
 } else{
  document.getElementById('taskTitle').classList.remove('error_Input');
  inputsOK[0]=true;
}
  checkAllRequiredData();
} 


function requiredInputDate(){
 let entry = document.getElementById('taskDate').value;
 let date = new Date(entry);
 let today = new Date(entry);
 if (date instanceof Date && !isNaN(date)) {
  let today = new Date();
  if (date > today) {
      document.getElementById('taskDate').classList.remove('error_Input');
      inputsOK[1]=true;
  } else {
      document.getElementById('taskDate').classList.add('error_Input');
      inputsOK[1]=false;
  }
} else {
   document.getElementById('taskDate').classList.add('error_Input');
  inputsOK[1]=false;
}
checkAllRequiredData();
}


 function requiredInputCategory(){
  let entry = document.getElementById('taskCatergory').value;
    if(entry ===""){
    inputsOK[2]=false;  
  }else{
   inputsOK[2]=true
   }
   checkAllRequiredData();
   }



function checkAllRequiredData(){
  if (inputsOK.every(value => value)) {
      document.getElementById('btnCreateTask').style.pointerEvents = 'auto'; 
      document.getElementById('btnCreateTask').style.opacity = '1';      
} else {
      document.getElementById('btnCreateTask').style.pointerEvents = 'none'; 
      document.getElementById('btnCreateTask').style.opacity = '0.5'
    }
}


function openDatePicker() {
  let dateInput = document.getElementById('taskDate');
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
    btnPrioBtnSelect("button_medium", "#FFA800", 1)
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
  let subTaskInput = document.getElementById('inputSubtask')
  if (flag) {
    subTaskInput.value === null;
    subTaskInput.focus();
  };
  if (subTaskInput) {
    document.getElementById('subTaskAddIcon').classList.add('ele_hide')
    document.getElementById('subTaskEditIocn').classList.remove('ele_hide')
  } else {
    document.getElementById('subTaskAddIcon').classList.remove('ele_hide')
    document.getElementById('subTaskEditIocn').classList.add('ele_hide')
  }
}


function subTaskClose() {
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
  let = index = 0;
  document.getElementById('taskDropDownList').innerHTML = "";
  taskContacteArray = Object.values(DataContact)
    .flatMap(array => array.map(entry => ({
      name: entry.name,
      email: entry.email,
      color: entry.color || "10"
    })));
  taskContacteArray.map((contact, index) => {
    taskRenderContactList(index, contact.name, contact.color || "10", contact.email);
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


function contactCheckOKinArray() {
  selectedTaskContacts = [];
  document.querySelectorAll(".contact_Label_Item").forEach((entry, contactID) => {
    let checkbox = entry.querySelector("input[type='checkbox']")
    if (checkbox && checkbox.checked) {
      selectedTaskContacts.push(taskContacteArray[contactID]);
      document.getElementById('initialeIconList').innerHTML = "";
      taskContacInitialRender(selectedTaskContacts);
    } else {
      document.getElementById('initialeIconList').innerHTML = "";
      taskContacInitialRender(selectedTaskContacts);
    }
  })
}


async function checkInputData(template) {
       pushTaskToServer();
        timePopUp(2000);
       addTaskClear();
       inputsOK=[false,false,false];
        if (template == "overlay") {
        setTimeout(() =>{
          loadTaskData();
          },200);
        closeOverlay('addTask_overlay')
      }
    }
 

function timePopUp(duration) {
  let notification = document.getElementById('notificationFinish');
  notification.style.display = "flex";
  setTimeout(() => {
    notification.style.display = "none";
  }, duration);
}


function collectData() {
  currentTaskAdd = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('descriptionTask').value.trim(),
    contacts: selectedTaskContacts,
    deadline: dateConversion(document.getElementById('taskDate').value),
    prio: taskPrioSelect, 
    category: taskCatergoryRetrieve(document.getElementById('taskCatergory').value), 
    subtasks: {
      total: taskSubTaskList.length, 
      number_of_finished_subtasks: 0, 
      subtasks_todo: subTasksObjects(),
    },
    status: statusSave() 
  }
}


function dateConversion(dateOld) {
  let date = new Date(dateOld);
  let day = String(date.getDate()).padStart(2, '0'); 
  let month = String(date.getMonth() + 1).padStart(2, '0'); 
  let year = String(date.getFullYear()).slice(-2); 
  return `${day}/${month}/${year}`;
}


function taskCatergoryRetrieve(number) {
  if (number === "1") {
    return "Technical Task";
  } else {
    return "User Story"
  }
}


function statusSave() {
  let catergory = localStorage.getItem("category")
  if (catergory) {
    localStorage.setItem("category", "");
    return catergory;
  } else {
    return "toDo";
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
  document.getElementById('taskTitle').value = "";
  document.getElementById('descriptionTask').value = "";
  loadDataFirebase();
  document.getElementById('taskContactDrowdownMenue').classList.remove("ele_show");
  selectedTaskContacts = [];
  document.getElementById('initialeIconList').innerHTML = "";
  document.getElementById('taskDate').value = "";
  btnPrioSelect('medium');
  document.getElementById('taskCatergory').value = "";
  document.getElementById('inputSubtask').value = "";
  subTaskClose();
  taskSubTaskList = [];
  subTaskClose();
  subTaskListRender();
  checkAllRequiredData();

}

