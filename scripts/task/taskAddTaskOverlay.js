/**
 *This function loads the data for the AddNewTask template and empties it at the same time 
 */
function taskAddOverlayInit() {
  document.getElementById('subTaskAddIcon').classList.remove('ele_hide');
  timePopUp(0);
  taskReadinArrayContact(DataContactsAll);
  editTaskWriteContacts(DataTaskContactsTask);
  checkAllRequiredData();
  loadDataFirebase();
  addTaskClear();
  setFocusontitle();
}


/**
 *focus on the title after 100ms bas addTaskOverlay
 */
function setFocusontitle() {
  setTimeout(() => {
    document.getElementById("taskTitle").focus();
  }, 100);
}