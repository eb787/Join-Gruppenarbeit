function taskAddOverlayInit() {
    document.getElementById('subTaskAddIcon').classList.remove('ele_hide');
    taskReadinArrayContact(DataContactsAll);
    editTaskWriteContacts(DataTaskContactsTask);
    requiredInputAddTask();
    focusOnRequiredFields();
    loadDataFirebase();
    addTaskClear();
}








