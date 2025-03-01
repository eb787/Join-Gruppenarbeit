function SubtaskListTemplate(subTaskdesignation,index){
return`
    <div class="sub_task_item">
    <div class="sublist_text">
       <span class="bullet">•</span>
       <span>${subTaskdesignation}</span>
   </div>
   <div class="icons">
       <img src="../assets/icons/edit.svg"  onclick="editSubTask(${index})">
       <img src="../assets/icons/delete.svg"onclick="deleteSubTask(${index})">
   </div>
</div>
`
}