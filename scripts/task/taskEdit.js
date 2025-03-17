
//Ab hier Task Edit
console.log("taskEdit.js");

let dataRaskEditContact = {};
let taskSubTaskListEdit=[];
let index="";
let contactList={};


function editTask(indexU) {
        index=indexU
        console.log("Es wird Task mit Index bearbeutetr ", index);
        loadContacsFirebase();
        document.getElementById('card_overlay').innerHTML = "";
        document.getElementById('card_overlay').innerHTML = editTaskTemplate(index);
        console.log("prio = ", currentTasks[index].prio);
        checkPrioEditTask(index);
        contactList=currentTasks[index].contacts;
        editTaskWriteContacts(contactList);
        subTaskListLoadEdit(index);
  }


function contactCheckOKinArray(index) {
        selectedTaskContacts = [];
        document.querySelectorAll(".contact_Label_Item").forEach((entry, contactID) => {
                let checkbox = entry.querySelector("input[type='checkbox']")
                if (checkbox && checkbox.checked) {
                        console.log("ID ", contactID)
                        selectedTaskContacts.push(taskContacteArray[contactID]);
                        document.getElementById('initialeIconList').innerHTML = "";
                        taskContacInitialRender(selectedTaskContacts);
                }
        })
        console.log("Namen mit Checkbox ", selectedTaskContacts);
}


function checkPrioEditTask(index) {
        let prio = currentTasks[index].prio;
console.log("Prio ausgeben ",prio);


        switch (prio) {
                case "high_prio":
                        btnPrioSelect('urgent')
                        break;
                case "medium_prio":
                        btnPrioSelect('medium')
                        break;
                case "low_prio":
                        btnPrioSelect('low')
                       break;
        }
}


function  editTaskWriteContacts(contactList) {
        console.log("Adressliste ",contactList);
        
        let element = document.getElementById('initialeIconList');
        contactList.map(emtry => {
                let name = emtry.name;
                let color = emtry.color;
             element.innerHTML += taskContacInitialTemplate(contactColorAssignEdit(color), taskInitialLettersCreate(name));
        });
}

function contactColorAssignEdit(color){
        return contactColorArray[color];
     }




function taskContactListDrobdown1() {
        console.log("Öffne Liste");
        taskReadinArrayContact(dataRaskEditContact);
        document.getElementById('taskContactDrowdownMenue').classList.toggle('ele_show');
        document.getElementById('initialeIconList').classList.toggle('icon_List_hide')
}


async function loadContacsFirebase() {
        try {
                let dataCont = await fetch(Base_URL + "/contacts/" + ".json")
                dataRaskEditContact = await dataCont.json();
                console.log("Contace ", dataRaskEditContact);
        } catch {
                console.log("Fehler beim Laden")
        }
}


function taskContactFilterList1() {
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



function subTaskListLoadEdit(index) {
        
        document.getElementById('subTaskAddIcon').classList.remove('ele_hide')
        document.getElementById('subTaskEditIocn').classList.add('ele_hide')
        if (currentTasks[index].subtasks.total != 0) {
                taskSubTaskListEdit = Object.keys(currentTasks[index].subtasks.subtasks_todo);
              //  element = document.getElementById('subTaskList');
              //  element.innerHTML = "";
              //  element.innerHTML += taskSubTaskListEdit.map((designation, index) =>
               //         SubtaskListTemplate(designation, index)
        //        ).join("");
        subTaskListRenderEdit(index, taskSubTaskListEdit);
        }
}


function subTaskListRenderEdit(index, taskSubTaskListEdit){
        element = document.getElementById('subTaskList');
        element.innerHTML = "";
        element.innerHTML += taskSubTaskListEdit.map((designation, index) =>
                SubtaskListTemplateEdit(designation, index)
        ).join("");

}



function taskCreateTaskEdit() {
        console.log("Hänge Task an");
        
        let element = document.getElementById('inputSubtask');
        contents = element.value;
        element.focus();
        if (editIndex) {
          taskSubTaskListEdit[editTaskNr] = contents
          editIndex = false;
          editTaskNr = 0;
        } else {
          taskSubTaskListEdit.push(contents);
        }
        subTaskClose();
        subTaskListRenderEdit(index,taskSubTaskListEdit);
       
        console.log("Array ", taskSubTaskListEdit);
      }


      function deleteSubTaskEdit(posi) {
        taskSubTaskListEdit.splice(posi, 1);
        console.log("Neue subtasj ",taskSubTaskListEdit);
        
        subTaskListRenderEdit(index, taskSubTaskListEdit);

      }


      function SubtaskListTemplateEdit(subTaskdesignation, index) {
        return `
        <div class="sub_task_item">
        <div class="sublist_text">
           <span class="bullet">•</span>
           <span ondblclick="editSubTask(${index})">${subTaskdesignation}</span>
       </div>
       <div class="icons">
           <img src="../assets/icons/edit.svg"  onclick="editSubTask(${index})">
           <img src="../assets/icons/delete.svg"onclick="deleteSubTaskEdit(${index})">
       </div>
    </div>
    `
    }




    function TaskEditSave(){
       console.log("Speichere taskEdit");
       taskEditContactsCheck();
       collectDataEdit();
       taskEditContactsCheck();
       //postTaskDataEdit(`/tasks/${parseInt(index)}`,currentTask);
        closeOverlay('bg_overlay')
    }


    function collectDataEdit() {
        currentTask = {
          title: document.getElementById('taskTitle').value,
          description: document.getElementById('descriptionTask').value.trim() || "empty",  // oder "empty" reinschreiben wenn es leer bleibt
          contacts: selectedTaskContacts,//
            deadline: dateConversion(document.getElementById('taskDate').value),
          prio: taskPrioSelect, // "medium_prio" , oder "low_prio", oder "hgh_prioi"
          //category: taskCatergoryRetrieve(document.getElementById('taskCatergory').value), // "Technical Task" oder "User Story"
          subtasks: {
            total: taskSubTaskListEdit.length, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
            number_of_finished_subtasks: 0, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
            subtasks_todo: subTasksObjects(),
          },
          //status: "toDo" //  "toDo",  "inProgress", "awaitFeedback", oder "done" 
        }
             }



             async function postTaskDataEdit(path = "", task) {
                let CurrentTaskResponse =  await fetch(Base_URL + path + ".json",{
                    method: "PUT",
                    header: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(task)
                });
             }



             function taskEditContactsCheck(){
                if(selectedTaskContacts.length>0){
                        console.log("Kontake vorhanden");
                        return selectedTaskContacts;
                }
                else{
                        console.log("Adressen beim speichern ",contactList.length);
                         if(contactList.length>0){
                           return selectedTaskContacts= contactList; 
                        }else{
                        console.log("Kein Kontake vorhanden"); 
                     if('contacts' in currentTask){
                       delete currentTask.contacts;        
              }}}}
        
        
                 
        
        