/**
 *This function loads the data for the AddNewTask template and empties it at the same time 
 */
function taskAddOverlayInit() {
    document.getElementById('subTaskAddIcon').classList.remove('ele_hide');
    taskReadinArrayContact(DataContactsAll);
    editTaskWriteContacts(DataTaskContactsTask);
    checkAllRequiredData();
    loadDataFirebase();
    addTaskClear(); 
}


