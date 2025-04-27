/**
 * Function to write the subtask list as an HTML element
 * @param {String} subTaskdesignation data from the Firebase DB of the subtasks
 * @param {Number} index  position of the subtask in the list (array)
 * @returns
 */
function SubtaskListTemplate(subTaskdesignation, index) {
  return `
    <div class="sub_task_item">
    <div class="sublist_text">
       <span class="bullet">•</span>
       <span ondblclick="editSubTask(${index})">${subTaskdesignation}</span>
   </div>
   <div class="icons">
       <img src="../assets/icons/edit.svg"  onclick="editSubTask(${index})">
       <img src="../assets/icons/delete.svg"onclick="deleteSubTask(${index})">
   </div>
</div>
`;
}


/**
 * Function to write the contacts as HTML
 * @param {Number} index position of the contact in the list (array)
 * @param {String} name  contact name
 * @param {Number} color Color number of the contact
 * @param {String} initials the initials of the contact
 * @param {String} email the contact's email address
 * @returns
 */
function taskContacListTemplate(index, name, color, initials, email, check) {
  return `
      <div class="contact_Label_Item">
     <label>
              <p class="initial_Letters_Contact" style="background-color: ${color};">${initials}</p>
              <span>${name}</span> 
              <input id="contactcheckbox(${index})" class="input_check" ${check} type="checkbox" onclick="contactCheckOKinArray(${index})">
     </label>
            </div>  
     `;
}

/**
 * function to write the initials with HTML
 * @param {Number} color
 * @param {String} initials
 * @returns
 */
function taskContacInitialTemplate(color, initials, numbers) {
  return `
        
           <span class="initial_Letters_Contact" style="background-color:  ${color}; margin-left: -15px;"> 
           ${initials} 
           </span>
         
           `;
}
