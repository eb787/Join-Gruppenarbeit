
//Ab hier Task Edit
console.log("taskEdit.js aufgerufen");

//Variablen Global
let indexEdit=0;
let  DataTaskEdit={};
let DataContactsAll="";

dataFromFirebase();



function editTask(index){ 
 indexEdit=index;
 console.log("EditTask aufgereufen");      
 TaskEditOverlayRender();
}



function TaskEditOverlayRender(){
    document.getElementById('card_overlay').innerHTML = "";
    document.getElementById('card_overlay').innerHTML = editTaskTemplate(indexEdit);        
    document.getElementById('taskTitle').value= DataTaskEdit[indexEdit].title;  //title
    document.getElementById('descriptionTask').value=DataTaskEdit[indexEdit].description;
    document.getElementById('taskDate').value=dateConversation(DataTaskEdit[indexEdit].deadline);




    console.log("Index ",indexEdit,"gelesem");


if (DataTaskEdit[indexEdit] && DataTaskEdit[indexEdit].title){
        console.log("Titel-- :" ,DataTaskEdit[indexEdit].title);
       
        
}else{
        console.log("Nichts vorhanden");
}
}




function checkPrioEditTask(index) {
        let prio = DataTaskEdit[indexEdit].prio;
        console.log("Prio ausgeben ", prio);
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





async function dataFromFirebase() {
        const {DataTask, DataContact} = await loadDataFirebaseEdit();
        DataTaskEdit=DataTask;
        DataContactsAll=DataContact
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
                return {DataTask,DataContact};
               
        } catch (error) {
            console.log("Fehler beim lesen ", error);
       }
    }
    
