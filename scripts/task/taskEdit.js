
//Ab hier Task Edit
console.log("taskEdit.js");

let dataRaskEditContact = {};
let taskSubTaskListEdit=[];
let index="";

function editTask(index) {
        index=index;
        console.log("Es wird Task mit Index bearbeutetr ", index);
        loadContacsFirebase();
        document.getElementById('card_overlay').innerHTML = "";
        document.getElementById('card_overlay').innerHTML = editTaskTemplate(index);
        console.log("prio = ", currentTasks[index].prio);
        checkPrioEditTask(index);
        editTaskWriteContacts(currentTasks[index].contacts);
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


function editTaskWriteContacts(contactList) {
        let element = document.getElementById('initialeIconList');
        contactList.map(emtry => {
                let name = emtry.name;
                let color = emtry.color;
                element.innerHTML += taskContacInitialTemplate(contactColorAssign(color), taskInitialLettersCreate(name));
        });
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