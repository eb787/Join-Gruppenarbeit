let currentTaskEdit = {};
let indexEdit = 0;
let DataTaskEdit = {};
let DataContactsAll = "";
let DataTaskPrio = "";
let DataTaskContactsTask = [];
let DataSubTaskListEdit = [];
let editIndexEdit = false;
let editTaskNrEdit = 0;
selectedTaskContacts = "";
subTaskArray = "";


dataFromFirebase();

/**
 * This function retrieves the data from the record with the given index that was previously loaded via dataFromFirebase
 * @param {string} index -  the index of the passed task
 */
function editTask(index) {
        indexEdit = index;
        DataTaskContactsTask = DataTaskEdit[indexEdit].contacts;
        TaskEditOverlayRender();
}

/**
 * Here the data is written into the overlay for Edit AddTask
 */
function TaskEditOverlayRender() {
        document.getElementById('card_overlay').innerHTML = "";
        document.getElementById('card_overlay').innerHTML = editTaskTemplate(indexEdit);
        document.getElementById('taskTitle').value = DataTaskEdit[indexEdit].title;  
        document.getElementById('descriptionTask').value = DataTaskEdit[indexEdit].description;
        document.getElementById('taskDate').value = dateConversation(DataTaskEdit[indexEdit].deadline);
        checkPrioEditTask(DataTaskEdit[indexEdit].prio); 
        taskReadinArrayContact(DataContactsAll);
        editTaskWriteContacts(DataTaskContactsTask);
        subTaskListLoadEdit()
}

/**
 * function which converts the date from the passed data set into the format dd.mm.yyyy
 * @param {string} dateStr -Date passed with the format dd/mm/yyyy
 * @returns 
 */
function dateConversation(dateStr) {
        let parts = dateStr.split("/"); // Teilt das Datum in ["13", "03", "25"]
        let day = parts[0];
        let month = parts[1];
        let year = "20" + parts[2]; // "25" -> "2025"
        return `${year}-${month}-${day}`;
    }

    
/**
 * function to determine the priority
 * @param {*} prio -Priority where clicked
 */
function checkPrioEditTask(prio) {
        switch (prio) {
                case "high_prio":
                        DataTaskPrio = "high_prio"
                        btnPrioSelect('urgent')
                        break;
                case "medium_prio":
                        DataTaskPrio = "medium_prio";
                        btnPrioSelect('medium')
                        break;
                case "low_prio":
                        DataTaskPrio = "low_prio";
                        btnPrioSelect('low')
                        break;
        }
}


/**
 * function to open and close the contact list
 */
function taskContactListDrobdownEdit() {
        document.getElementById('taskContactDrowdownMenue').classList.toggle('ele_show');
        document.getElementById('initialeIconList').classList.toggle('icon_List_hide')
}


/**
 * function that passes the contacts from the array DataTaskEdit to conta
 */
function taskContactsLoadTaskDB() {
        let conta = DataTaskEdit[indexEdit].contacts;
}


/**
 * 
 * @param {*} DataContacts 
 */
function editTaskWriteContacts(DataContacts) {
        if (DataContacts.length > 0) {
                let element = document.getElementById('initialeIconList');
                DataContacts.map(emtry => {
                        let name = emtry.name;
                        let color = emtry.color;
                        element.innerHTML += taskContacInitialTemplate(contactColorAssignEdit(color), taskInitialLettersCreate(name));
                });
                function contactColorAssignEdit(color) {
                        return contactColorArray[color];
                }
        }
}

/**
 * the function gets the color from the array for the contact initials
 * @param {string} color - color that comes from the DB
 * @returns 
 */
function contactColorAssignEdit(color) {
        return contactColorArray[color];
}


/**
 * Function to load the subtask into a list
 */
function subTaskListLoadEdit() {
        document.getElementById('subTaskAddIcon').classList.remove('ele_hide')
        document.getElementById('subTaskEditIocn').classList.add('ele_hide')
        if (DataTaskEdit[indexEdit].subtasks.total > 0) {
                DataSubTaskListEdit = Object.keys(DataTaskEdit[indexEdit].subtasks.subtasks_todo);
                subTaskListRenderEdit(DataSubTaskListEdit);
        }
}


/**
 * Function to render the data of the subtask list into an HTML element
 * @param {Array} taskSubList - Array where the subtasks are located
 */
function subTaskListRenderEdit(taskSubList) {
        element = document.getElementById('subTaskList');
        element.innerHTML = "";
        element.innerHTML += taskSubList.map((designation, index) =>
                SubtaskListTemplateEdit(designation, index)).join("");
}


/**
 * output the subtask list as an HTML template
 * @param {String} subTaskEntry  entry from the array
 * @param {Number} index  entry from the array
 * @returns 
 */
function SubtaskListTemplateEdit(subTaskEntry, index) {
        return `
        <div class="sub_task_item">
        <div class="sublist_text">
           <span class="bullet">•</span>
           <span ondblclick="editSubTaskEdit(${index})">${subTaskEntry}</span>
       </div>
       <div class="icons">
           <img src="../assets/icons/edit.svg"  onclick="editSubTaskEdit(${index})">
           <img src="../assets/icons/delete.svg"onclick="deleteSubTaskEdit(${index})">
       </div>
    </div>
    `
}


/**
 * Function that writes a new subtask to the array DataSubTaskListEdit
 */
function taskCreateTaskEdit() {
        let element = document.getElementById('inputSubtask');
        contents = element.value;
        element.focus();
        if (editIndexEdit) {
                DataSubTaskListEdit[editTaskNr] = contents
                editIndexEdit = false;
                editTaskNrEdit = 0;
        } else {
                DataSubTaskListEdit.push(contents);
        }
        subTaskClose();
        subTaskListRenderEdit(DataSubTaskListEdit);
}

/**
 * Function that brings the subtask into the input field for processing
 * @param {Number} index index is the number of the subtask from list of to be processed
 */
function editSubTaskEdit(index) {
        let element = document.getElementById('inputSubtask');
        element.value = DataSubTaskListEdit[index];
        document.getElementById('subTaskAddIcon').classList.add('ele_hide')
        document.getElementById('subTaskEditIocn').classList.remove('ele_hide')
        editTaskNrEdit = index;
        editIndexEdit = true;
}


/**
 * Function to delete a subtask
 * @param {*} index specifies the position of the subtask in the array
 */
function deleteSubTaskEdit(index) {
        DataSubTaskListEdit.splice(index, 1);
        subTaskListRenderEdit(DataSubTaskListEdit);
}

/**
 * function to save the subtask when editing
 */
async function TaskEditSave() {
        collectDataEdit();
        await postTaskDataEdit(`/tasks/${parseInt(indexEdit)}`, currentTaskEdit);
        await fetchTaskData();
        updateTaskBoard();
        closeOverlay('bg_overlay')
}


/**
 * function creates object to save in FirbaseDB
 */
function collectDataEdit() {
        currentTaskEdit = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('descriptionTask').value.trim(),  
                contacts: checkContacts(),
                deadline: dateConversion(document.getElementById('taskDate').value),
                prio: DataTaskPrio, 
                category: DataTaskEdit[indexEdit].category,
                subtasks: {
                        total: DataSubTaskListEdit.length, 
                        number_of_finished_subtasks: 0, 
                        subtasks_todo: subtaskinObjekt(DataSubTaskListEdit),
                },
                status: DataTaskEdit[indexEdit].status,  
        }
}


/**
 * function checks if contacts exist for this task and writes sisin object for transfer
 * @returns 
 */
function checkContacts() {
        if (selectedTaskContacts.length > 0) {
                return selectedTaskContacts
        }
        else {
                if (DataTaskContactsTask.length > 0) {
                        return DataTaskContactsTask;
                }
                return "";
        }
}



async function postTaskDataEdit(path = "", task) {
        let CurrentTaskResponse = await fetch(Base_URL + path + ".json", {
                method: "PUT",
                header: {
                        "Content-Type": "application/json",
                },
                body: JSON.stringify(task)
        });
}


async function dataFromFirebase() {
        const { DataTask, DataContact } = await loadDataFirebaseEdit();
        DataTaskEdit = DataTask;
        DataContactsAll = DataContact
}


/**
 * Loading data from FirebaseDB for the AddTask Edit template
 * @returns 
 */
async function loadDataFirebaseEdit() {
        try {
                const [responseTask, responseContact] = await Promise.all([
                        fetch(Base_URL + "/tasks/" + ".json"),
                        fetch(Base_URL + "/contacts/" + ".json")
                ])
                const DataTask = await responseTask.json();
                const DataContact = await responseContact.json();
                return { DataTask, DataContact };
        } catch (error) {
                console.log("Fehler beim lesen ", error);
        }
}


/**
 * Function writes the subTask from the object into an array
 * @param {*} subTaskArray  object with the data where the subtasks are located
 * @returns 
 */
function subtaskinObjekt(subTaskArray) {
        return subTask = Object.fromEntries(subTaskArray.map(item => [item, "todo"]));
}