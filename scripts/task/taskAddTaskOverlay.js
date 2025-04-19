/**
 *This function loads the data for the AddNewTask template and empties it at the same time 
 */
function taskAddOverlayInit() {
    console.log("öffner Overlay");
    
    document.getElementById('subTaskAddIcon').classList.remove('ele_hide');
    timePopUp(0);
    taskReadinArrayContact(DataContactsAll);
    editTaskWriteContacts(DataTaskContactsTask);
    checkAllRequiredData();
    loadDataFirebase();
    addTaskClear(); 
}

