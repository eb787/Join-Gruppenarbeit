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
`
}


function taskContacListTemplate(index,name, color, initials,email) {
    console.log("Emial",email);
    console.log("Index",index);
    return `
      <div class="contact_Label_Item">
     <label>
              <p class="initial_Letters_Contact" style="background-color: ${color};">${initials}</p>
              <span>${name}</span> 
              <input class="input_check" type="checkbox" onclick="contactCheckOKinArray(${index})">
     </label>
            </div>  
     `
}
