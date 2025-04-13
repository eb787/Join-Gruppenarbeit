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


/**
 * start function of addtask
 */
function init() {
  startAddTask();
  loadDataFirebase();
  checkAllRequiredData();
  subTaskListRender();
  showHelpIconMobile()
}


/**
 * function that displays the plus in subtask
 */
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



/**
 * function checks the correct input in the field title
 * @param {String} template for which template is the test
 */
function requiredInputTitle(template){
let entry = document.getElementById('taskTitle').value;
if (entry.trim() ===""){
  document.getElementById('taskTitle').classList.add('error_Input');
  document.getElementById('error_Field_Title').innerHTML="This field is required";
  inputsOK[0]=false;
 } else{
  document.getElementById('taskTitle').classList.remove('error_Input');
  document.getElementById('error_Field_Title').innerHTML='&nbsp;';
    inputsOK[0]=true;
}
if(template==="edit"){
  checkAllRequiredDataEdit()
 }else{
  checkAllRequiredData();
 }
} 

/**
 * function checks the correct input in the field date
 * @param {String} template for which template is the test
 */
function requiredInputDate(template){
 let entry = document.getElementById('taskDate').value;
 let date = new Date(entry);
 let today = new Date(entry);
 if (date instanceof Date && !isNaN(date)) {
  let today = new Date();
  if (date > today) {
      document.getElementById('taskDate').classList.remove('error_Input');
      document.getElementById('error_Field_Date').innerHTML='&nbsp;';
      inputsOK[1]=true;
      if(template==="edit"){inputsOK[1]=true;};
  } else {
      document.getElementById('taskDate').classList.add('error_Input');
      document.getElementById('error_Field_Date').innerHTML="This field is required";
      inputsOK[1]=false;
  }
} else {
   document.getElementById('taskDate').classList.add('error_Input');
   document.getElementById('error_Field_Date').innerHTML="This field is required";
  inputsOK[1]=false;
}
if(template==="edit"){
  checkAllRequiredDataEdit()
 }else{
  checkAllRequiredData();
 }

}


/**
 * function checks the correct input in the field Catergory
 */
 function requiredInputCategory(){
  let entry = document.getElementById('taskCatergory').value;
    if(entry ===""){
    inputsOK[2]=false;  
    document.getElementById('taskCatergory').classList.add('error_Input');
    document.getElementById('error_Field_Catergory').innerHTML="This field is required";
   }else{
   inputsOK[2]=true
   document.getElementById('taskCatergory').classList.remove('error_Input');
   document.getElementById('error_Field_Catergory').innerHTML='&nbsp;';
   }
   checkAllRequiredData();
  }

/**
 * function checks whether the entry in all three mandatory fields is correct
 */
function checkAllRequiredData(){
  if (inputsOK.every(value => value)) {
      document.getElementById('btnCreateTask').style.pointerEvents = 'auto'; 
      document.getElementById('btnCreateTask').style.opacity = '1';      
} else {
      document.getElementById('btnCreateTask').style.pointerEvents = 'none'; 
      document.getElementById('btnCreateTask').style.opacity = '0.5'
    }
}


/**
 * function opens datepicker
 */
function openDatePicker() {
  let dateInput = document.getElementById('taskDate');
  if (dateInput.showPicker) {
    dateInput.showPicker();
    document.getElementById('taskDate').focus();
  } else {
    dateInput.focus();
  }
}

/**
 * function controls the priority option
 * @param {String} btnPrio function controls the priority option
 */
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

/**
 * function controls PrioButton color
 * @param {String} auswahl selected button
 * @param {String} btnColor color of the button background
 * @param {Number} id 
 */
function btnPrioBtnSelect(auswahl, btnColor, id) {
  Object.assign(document.getElementsByClassName(auswahl)[0].style, {
    backgroundColor: btnColor,
    color: "white",
  })
  document.getElementsByClassName("prio_img")[id].classList.add('prio_img_with');
}


/**
 * function opens the list of SubTask
 * @param {Boolean} flag status of the list
 */
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


/**
 * function closes the subtask list
 */
function subTaskClose() {
  document.getElementById('subTaskAddIcon').classList.remove('ele_hide')
  document.getElementById('subTaskEditIocn').classList.add('ele_hide')
  document.getElementById('inputSubtask').value = "";
}


/**
 * function to create a new subtask
 */
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

/**
 * function for processing a subtask
 * @param {Nummber} index position in the array
 */
function editSubTask(index) {
  let element = document.getElementById('inputSubtask');
  element.value = taskSubTaskList[index];
  document.getElementById('subTaskAddIcon').classList.add('ele_hide')
  document.getElementById('subTaskEditIocn').classList.remove('ele_hide')
  editTaskNr = index;
  editIndex = true;
}


/**
 * function to delete a subtask
 * @param {Nummber} index position in the array
 */
function deleteSubTask(index) {
  taskSubTaskList.splice(index, 1);
  subTaskListRender();
}

/**
 * function to write the subtask into the array
 * @param {String} taskData Contents of the subtask
 */
function taskReadinArrayTask(taskData) {
  taskId = Object.values(taskData).length;
}


/**
 * function writes the contacts into the array for the list
 * 
 * @param {*} DataContact data from FirebaseDB
 */
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


/**
 * function to open the contact list
 */
function taskContactListDrobdown() {
  document.getElementById('taskContactDrowdownMenue').classList.toggle('ele_show');
  document.getElementById('initialeIconList').classList.toggle('icon_List_hide')
}


/**
 * function to write the contacts into the list
 */
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


/**
 *function that checks whether a contact has been selected 
 */
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


/**
 * function to save the data
 * @param {String} template from which input does the data come
 */
async function checkInputData(template) {
        pushTaskToServer();
        timePopUp(2000);

        inputsOK=[false,false,false];
        if (template == "overlay") {
          setTimeout(() =>{
          loadTaskData();
          },200);
          closeOverlay('addTask_overlay')              
      }
          addTaskClear();   
    }
 

 /**
  * function to display the popup data is saved
  * @param {Number} duration time how long the popup is visible
  */   
function timePopUp(duration) {
  let notification = document.getElementById('notificationFinish');
  notification.style.display = "flex";
  setTimeout(() => {
    notification.style.display = "none";
  }, duration);
 
}


/**
 * function to collect the data which is then stored in the db
 */
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

/**
 * function to convert the date
 * @param {String} dateOld date being converted
 * @returns 
 */
function dateConversion(dateOld) {
  let date = new Date(dateOld);
  let day = String(date.getDate()).padStart(2, '0'); 
  let month = String(date.getMonth() + 1).padStart(2, '0'); 
  let year = String(date.getFullYear()).slice(-2); 
  return `${day}/${month}/${year}`;
}

/**
 * function to check which category was selected
 * @param {Number} number 
 * @returns 
 */
function taskCatergoryRetrieve(number) {
  if (number === "1") {
    return "Technical Task";
  } else {
    return "User Story"
  }
}


/**
 * function to check in which card the data coming from OverlayTemplate is saved
 * @returns 
 */
function statusSave() {
  let catergory = localStorage.getItem("category")
  if (catergory) {
    localStorage.setItem("category", "");
    return catergory;
  } else {
    return "toDo";
  }
}


/**
 * function to read status todo
 * @returns 
 */
function subTasksObjects() {
  let todoSatus = "todo";
  let subTasksTodo = {};
  taskSubTaskList.forEach(task => {
    subTasksTodo[task] = todoSatus;
  });
  return subTasksTodo;
}



function errorFieldsFocus(tag){
  document.getElementById(tag).innerHTML='&nbsp;';
}


/**
 * delete all error fields
 */
function errorFieldsClear(){
  document.getElementById('taskTitle').classList.remove('error_Input');
  document.getElementById('error_Field_Title').innerHTML='&nbsp;';
  document.getElementById('taskDate').classList.remove('error_Input');
  document.getElementById('error_Field_Date').innerHTML='&nbsp;';
  document.getElementById('taskCatergory').classList.remove('error_Input');
  document.getElementById('error_Field_Catergory').innerHTML='&nbsp;';
 }


/**
 * function to delete the fields in the input mask
 */
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
  errorFieldsClear();

 
}

