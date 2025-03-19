
//Ab hier Task Edit
console.log("taskEdit.js aufgerufen");

//Variablen Global
let currentTaskEdit = {};
let indexEdit = 0;
let DataTaskEdit = {};
let DataContactsAll = "";
let DataTaskPrio = "";
let DataTaskContactsTask = [];
let DataSubTaskListEdit = [];
let editIndexEdit = false;
let editTaskNrEdit = 0;


dataFromFirebase();



function editTask(index) {
        indexEdit = index;
        DataTaskContactsTask = DataTaskEdit[indexEdit].contacts;
        console.log("EditTask aufgereufen", indexEdit);
        TaskEditOverlayRender();

}


function TaskEditOverlayRender() {
        document.getElementById('card_overlay').innerHTML = "";
        document.getElementById('card_overlay').innerHTML = editTaskTemplate(indexEdit);
        document.getElementById('taskTitle').value = DataTaskEdit[indexEdit].title;  //title
        document.getElementById('descriptionTask').value = DataTaskEdit[indexEdit].description;
        document.getElementById('taskDate').value = dateConversation(DataTaskEdit[indexEdit].deadline);
        checkPrioEditTask(DataTaskEdit[indexEdit].prio); //prio setzen 
        taskReadinArrayContact(DataContactsAll);
        editTaskWriteContacts(DataTaskContactsTask);
        subTaskListLoadEdit()
}



function checkPrioEditTask(prio) {

        console.log("Prio ausgeben ", prio);
        switch (prio) {
                case "high_prio":
                        btnPrioSelect('urgent')
                        DataTaskPrio = "high_prio"
                        break;
                case "medium_prio":
                        btnPrioSelect('medium')
                        DataTaskPrio = "medium_prio";
                        break;
                case "low_prio":
                        btnPrioSelect('low')
                        DataTaskPrio = "low_prio";
                        break;
        }
        console.log("Aktuel prio ", DataTaskPrio);

}


function taskContactListDrobdownEdit() {
        document.getElementById('taskContactDrowdownMenue').classList.toggle('ele_show');
        document.getElementById('initialeIconList').classList.toggle('icon_List_hide')
}



function taskContactsLoadTaskDB() {
        let conta = DataTaskEdit[indexEdit].contacts;
}


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



function contactColorAssignEdit(color) {
        return contactColorArray[color];
}



function subTaskListLoadEdit() {
        document.getElementById('subTaskAddIcon').classList.remove('ele_hide')
        document.getElementById('subTaskEditIocn').classList.add('ele_hide')
        if (DataTaskEdit[indexEdit].subtasks.total > 0) {
                DataSubTaskListEdit = Object.keys(DataTaskEdit[indexEdit].subtasks.subtasks_todo);
                subTaskListRenderEdit(DataSubTaskListEdit);
        }


}

function subTaskListRenderEdit(taskSubList) {
        element = document.getElementById('subTaskList');
        element.innerHTML = "";
        element.innerHTML += taskSubList.map((designation, index) =>
                SubtaskListTemplateEdit(designation, index)).join("");
}


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


function editSubTaskEdit(index) {
        console.log("SUBTask mit Nummer ", index);

        let element = document.getElementById('inputSubtask');
        element.value = DataSubTaskListEdit[index];
        document.getElementById('subTaskAddIcon').classList.add('ele_hide')
        document.getElementById('subTaskEditIocn').classList.remove('ele_hide')
        editTaskNrEdit = index;
        editIndexEdit = true;
}




function deleteSubTaskEdit(posi) {
        DataSubTaskListEdit.splice(posi, 1);
        console.log("Neue subtasj ", DataSubTaskListEdit);
        subTaskListRenderEdit(DataSubTaskListEdit);
}


function TaskEditSave() {
        console.log("Speichere taskEdit");
        collectDataEdit();
      
        console.log(DataTaskEdit[indexEdit].status);
        console.log(selectedTaskContacts);
        console.log(subtaskinObjekt(DataSubTaskListEdit));

        console.log(checkContacts());

        //postTaskDataEdit(`/tasks/${parseInt(indexEdit)}`, currentTaskEdit);
        //updateTaskBoard();
        //closeOverlay('bg_overlay')



}


function subtaskinObjekt(subTaskArray){
       return subTask = Object.fromEntries(subTaskArray.map(item => [item, "done"]));
}


function collectDataEdit() {
        currentTaskEdit = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('descriptionTask').value.trim(),  // oder "empty" reinschreiben wenn es leer bleibt
                contacts: selectedTaskContacts,//
                deadline: dateConversion(document.getElementById('taskDate').value),
                prio: DataTaskPrio, // "medium_prio" , oder "low_prio", oder "hgh_prioi"
                subtasks: {
                        total: DataSubTaskListEdit.length, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
                        number_of_finished_subtasks: 0, // das ist wichtig zum runterladen, daher bitte auf die Datenbank speichern
                        subtasks_todo:subtaskinObjekt(DataSubTaskListEdit),
                },
                status: DataTaskEdit[indexEdit].status,  //  "toDo",  "inProgress", "awaitFeedback", oder "done" 
        }
}





function checkContacts(){
    if (Object.keys(DataTaskPrio)){
       return DataTaskPrio;    
    }
    else{
    return  DataTaskContactsTask;
    }
}





async function postTaskDataEdit(path = "", task) {
        console.log("Schreibe in DB");
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
        console.log("Test", DataTaskEdit);
        console.log("Test1", DataContactsAll);
}


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

