function getExampleCard(index, layer) {
    return `<div id="card_number_${index}" class="card" onclick="showCardOverlay(${index})" draggable="true" ondragstart="startDragging(${index})">
                <div class="card_header">
                    <div id="category_${index}${layer}" class="task_category technical_task">${currentTasks[index].category}</div>
                    <div onclick="stopPropagation(event)" id="change_category_btn_${index}">
                        <img onclick="openCategoryOverlay(event, ${index})" id="change_category_icon_${index}" class="change_category_btn" src="..//assets/icons/change_category_icon.png" alt="change category">
                    </div>
                </div>
                <div>
                    <div class="task_name">${currentTasks[index].title}</div>
                    <div id="description_${index}_${layer}" class="task_description">${currentTasks[index].description.slice(0, 50)}...</div>
                </div>
                <div id="subtasks_box${index}_${layer}"></div>
                <div class="card_footer">
                    <div id="Profile_badges_${index}_${layer}" class="profile_badges"></div>
                    <img class="prio_icon ${currentTasks[index].prio}_${layer}" src="..//assets/icons/${currentTasks[index].prio}.svg" alt="priority indicator">
                </div>                          
            </div>`
}


function getSubtasks(index, subtasks, progress, layer) {
    return `<div id="subtasks_${index}_${layer}" class="progress_box">
                <div class="progress_bar">
                    <div id="progress_${index}_${layer}" class="progress" style="width: ${progress}%;"></div>
                </div>
                <div style="display: flex; flex-direction: row; gap: 1px; align-items: center;">
                    <h4 id="subtasks_done" style="font-weight: 400;">${currentTasks[index].subtasks.number_of_finished_subtasks}</h4>
                    <h4 style="font-weight: 400;">/</h4>
                    <h4 id="subtasks_total" style="font-weight: 400;">${subtasks}</h4><br><br>
                    <h4 style="font-weight: 400;">Subtasks</h4>
                </div>                   
            </div>`
}


function getContactIcon(index, i, layer) {
    return `<div id="profile_${index}_${i}_${layer}" class="profile_badge" style="z-index: ${i + 1}; position: relative; left: calc(${i} * -8px); background-color: ${contactColorArray[(currentTasks[index].contacts[i].color)]};"></div>`
}


function getContactDots(moreContacts) {
    return `<div class="dots_more_content">+${moreContacts}</div>`
}


function getNoTasksToDoCard() {
    return `<div id="no_task_toDo" class="no_tasks">No tasks To do</div>`
}


function getNoTasksInProgressCard() {
    return `<div id="no_task_inProgress" class="no_tasks">No tasks In progress</div>`
}


function getNoTasksAwaitFeedbackCard() {
    return `<div id="no_task_awaitFeedback" class="no_tasks">No tasks Await feedback</div>`
}


function getNoTasksDoneCard() {
    return `<div id="no_task_done" class="no_tasks">No tasks Done</div>`
}


function getPlaceholder() {
    return `<div class="placeholder"></div>`
}


function getBgOverlay() {
    return `<div onclick="closeOverlay('bg_overlay')" id="bg_overlay" class="bg_overlay d_none"></div>`
}


function getCardOverlayContent(index) {
    return `<div onclick="stopPropagation(event)" id="card_overlay" class="card_overlay_board slide-in-overlay">
                <div class="card_overlay_header">
                    <div id="category_${index}_overlay" class="task_category task_category_overlay technical_task_overlay ">${currentTasks[index].category}</div>
                    <div class="close_btn_overlay">
                        <img onclick="closeOverlay('bg_overlay')"  src="..//assets/icons/close.svg" alt="close button">
                    </div>
                </div>
                <div style="overflow-wrap: break-word;">
                    <h1 class="board_heading">${currentTasks[index].title}</h1>
                </div>
                <div class="task_description_overlay">${currentTasks[index].description}</div>
                <div class="task_description_overlay">
                    <p class="color_blue font_weight_700">Due Date:</p>
                    <p>${currentTasks[index].deadline}</p>
                </div>
                <div class="task_description_overlay">
                    <p class="color_blue al_center font_weight_700">Priority:</p>
                    <div class="priority_div">
                        <div id="prio_text_${index}">Medium</div>
                        <img class="prio_icon" src="..//assets/icons/${currentTasks[index].prio}.svg" alt="priority indicator">
                    </div>
                </div>
                <div id="task_description_overlay_${index}" class="task_description_overlay fd_column gap_8"></div>
                <div id="subtasks_box_overlay${index}"></div>
                <div  class="overlay_options">
                    <div onclick="deleteTask(${index})" class="overlay_option delete_btn_overlay_board">
                        <img class="delete_icon" src="..//assets/icons/delete.svg" alt="delete button">
                        <p>Delete</p>
                    </div>
                    <div class="seperator_overlay_options"></div>
                    <div onclick="editTask(${index})"  class="overlay_option edit_btn_overlay_board">
                        <img class="edit_icon" src="..//assets/icons/edit.svg" alt="edit button">
                        <p >Edit</p>
                    </div>
                </div>
            </div>`
}


function getSubtasksOverlay(index) {
    return `<div class="task_description_overlay fd_column gap_8">
                <p class="color_blue font_weight_700">Subtasks</p>
                <div id="tasks_box${index}"> </div>
            </div>`
}


function getTaskOverlay(index, i) {
    return `<div id="check_box_${index}_info${i}" onclick="changeSubtaskCategory(${index}, ${i})" class="task_info">
                <div id="check_box_${index}_btn${i}" class="check_box_btn"></div>
                <p class="font_16">${Object.keys(currentTasks[index].subtasks.subtasks_todo)[i]}</p>
            </div>`
}


function getContactBoxOverlay(index) {
    return `<p class="color_blue font_weight_700">Assigned To:</p>
            <div id="profile_badges_overlay${index}"></div>`
}


function getContactIconOverlay(index, i) {
    return `<div class="contact_info">
                <div id="profile_${index}_${i}_overlay"  class="profile_badge profile_badge_overlay" style="background-color: ${contactColorArray[(currentTasks[index].contacts[i].color)]};"></div>
                <p class="font_19">${currentTasks[index].contacts[i].name}</p>
            </div>`
}


function getBgCategory() {
    return `<div onclick="closeCategoryOverlay()" class="bg_category d_none" id="bg_category"></div>`
}

function getDragOptionsMobile(index, x, y) {
    return `<div class="div_category_menu" style="position:absolute;top:${y}px;left:${x}px;">
                <div class="category_menu">
                    <p class="category_menu_heading">Move to</p>
                    <div onclick="moveCardMobileVersion(${index},'toDo')" class="div_category_options" id="div_category_options_toDo">
                        <img id="arrow_up_toDo_${index}" class="d_none" src="..//assets/icons/arrow_upward.svg" alt="arrow upward">
                        <p class="category_menu_text">To do</p>
                    </div>
                    <div onclick="moveCardMobileVersion(${index}, 'inProgress')" class="div_category_options" id="div_category_options_inProgress">
                        <img id="arrow_down_inProgress_${index}" class="d_none" src="..//assets/icons/arrow_downward.svg" alt="arrow upward">
                        <img id="arrow_up_inProgress_${index}" class="d_none" src="..//assets/icons/arrow_upward.svg" alt="arrow upward">
                        <p class="category_menu_text">In progress</p>
                    </div>
                    <div onclick="moveCardMobileVersion(${index}, 'awaitFeedback')" class="div_category_options" id="div_category_options_awaitFeedback">
                        <img id="arrow_down_awaitFeedback_${index}" class="d_none" src="..//assets/icons/arrow_downward.svg" alt="arrow upward">
                        <img id="arrow_up_awaitFeedback_${index}" class="d_none" src="..//assets/icons/arrow_upward.svg" alt="arrow upward">
                        <p class="category_menu_text">Review</p>
                    </div>
                    <div onclick="moveCardMobileVersion(${index}, 'done')" class="div_category_options" id="div_category_options_done">
                        <img id="arrow_down_done_${index}" class="d_none" src="..//assets/icons/arrow_downward.svg" alt="arrow upward">
                        <p class="category_menu_text">Done</p>
                    </div>
                </div>
            </div>`
}


function getMobileDragger(index) {
    return `<img onclick="openCategoryOverlay(event, ${index})" id="change_category_icon_${index}" class="change_category_btn" src="..//assets/icons/change_category_icon.png" alt="change category">`
}


function editTaskTemplate(index) {

    return `
    
        <div class="card_overlay_header">
            <div id="category_overlay${index}" class="task_category task_category_overlay  "></div>
           
           <div class="close_btn_overlay">
              <img onclick="closeOverlay('bg_overlay')"  src="..//assets/icons/close.svg" alt="close button">
            </div>
        
        </div>
             
                <div class="section_title">
                    <h2 class="title">Title</h2>
                    <input id="taskTitle" class="input_title" type="text" onblur="requiredInputTitle('edit')" onmouseleave="requiredInputTitle('edit')" onfocus="errorFieldsFocus('error_Field_Title')" tabindex="1">
                     <span id="error_Field_Title" class="error_Field">&nbsp;</span>
                 </div>

                 <div class="section_description">
                     <h2>Description</h2>
                     <div class="textarea_description">
                     <textarea id="descriptionTask" class="text_area" placeholder="Enter a Description"
                     tabindex="2"></textarea>
                     </div>
                 </div>

            
            <div class="section_date_div">
                <h2>Due date </h2>
                <div class="task_Date_Input_Div">
                   <input type="date"  id="taskDate" class="date_input" onblur="requiredInputDate('edit')" onchange="requiredInputDate('edit')" onfocus="errorFieldsFocus('error_Field_Date')"tabindex="4" >
                   <img src="../assets/icons/event.png" class="date_icon_Edit" onclick="openDatePicker()" >
                </div>
                <span id="error_Field_Date" class="error_Field">&nbsp;</span>
            </div>
            <div class="section_prio">
            <div>    
            <h2>Priority</h2>
            </div>

                <div class="prio_buttons">
                       <button onclick="btnPrioSelect('urgent');checkPrioEditTask('high_prio')" class="btn_prio button-urgent" tabindex="5">Urgent
                       <img class="prio_img" src="../assets/icons/high_prio.svg" alt="urgent">
                    </button>
                    <button onclick="btnPrioSelect('medium');checkPrioEditTask('medium_prio')" class="btn_prio button_medium" tabindex="6">Medium
                        <div id="btnPrioGroup" class="prio_img prio_img_group">
                            <img src="../assets/icons/linePrio.svg">
                            <img src="../assets/icons/linePrio.svg">
                        </div>
                    </button>
                    <button onclick="btnPrioSelect('low');checkPrioEditTask('low_prio')" class="btn_prio button-low" tabindex="7">Low
                        <img class="prio_img" src="../assets/icons/low_prio.svg">
                    </button>
                </div>
            </div>
            <div class="section_assigned">
                <span class="assigned_title">Assigned to</span>
                <div class="task_Contact_dropdown" onmouseleave="taskContactListDrobdownEditClose()">
                    <div class="task_input_section">
                        <input type="text" id="taskDropDownInput" class="task_dropdown_input" tabindex="3" placeholder="Select contacts to assign" onclick="taskContactListDrobdownEdit()" onkeyup="taskContactFilterList1()">
                        <img src="../assets/icons/arrow_down.svg" >
                    </div>
                    <div id="taskContactDrowdownMenue" class="task_dropdown_content">
                        <div id="taskDropDownList" class="task_dropdown_list"></div>
                    </div>
                </div>
            </div>
            <div id="initialeIconList" class="initiale_Icon_ListEdit icon_List_hide"></div>
            <div class="section_Subtask">
                        <h2>Subtasks</h2>
                        <div class="input_wrapper">
                            <input type="text" placeholder="Add new subtask"   id="inputSubtask" class="input_subtasks" oninput="subTaskInputCheck()">                                                
                       
                            <img src="../assets/icons/add.png" id="subTaskAddIcon" class="add_subtasks_new ele_hide" onclick="subTaskInputCheck(true)">
                            
                            
                            <div id="subTaskEditIocn" class="add_subtasks sub_Task_Edit_Iocn ele_hide">
                                <img id="subTaskCloseIcon" onclick="subTaskClose()" src="../assets/icons/close.svg">
                                <img src="../assets/icons/vectorV.svg">
                                <img id="subTaskCheckIcon" onclick="taskCreateTaskEdit()" src="../assets/icons/checkSW.svg">
                            </div>

                           </div>
                            
                                <div id="subTaskList" class="subtask_list"></div>
                              
                </div>   
                    
                        
                        <div class="btn_div">
                            <button id="button_Ok_Edit"  class="button_Ok" onclick="TaskEditSave()" >OK<img src="../assets/icons/check.svg"></button>
                         </div>
      
   `

}



function getAddTaskOverlay() {

    return ` 
        
     <div onclick="closeOverlay('addTask_overlay')" id="addTask_overlay" class="bg_overlay d_none">
              
         <div onclick="stopPropagation(event)" id="addTask_card" class="addTask_overlay">
            <div class="close_btn_AddOverlay">
            <img  src="..//assets/icons/close.svg" onclick="closeOverlay('addTask_overlay')">
            </div>            
                     <p class="addTask_Title_ol">Add Task</p>
                         <div class="container_AddTask_ol"> 
                                   <div class="section_left_ol">
                                        <div class="section_title_ol">
                                            <h2 class="title">Title<span class="star_red_ol">*</span></h2>
                                            <input id="taskTitle" class="input_title_ol" onblur="requiredInputTitle()" onmouseleave="requiredInputTitle()" onfocus="errorFieldsFocus('error_Field_Title')" type="text"
                                            placeholder="Enter a title" tabindex="1">
                                             <span id="error_Field_Title" class="error_Field">&nbsp;</span>
                                             </div>  

                                        <div class="section_description_ol">
                                            <h2>Description</h2>
                                            <div class="textarea_description_ol">
                                                <textarea id="descriptionTask" class="text_area_ol" placeholder="Enter a Description"
                                                tabindex="2"></textarea>
                                            </div>
                                        </div>

  
                                     <div class="section_assigned_ol">
                                         <h2 class="assigned_title_ol">Assigned to</h2>
                                                <div class="task_Contact_dropdown_ol" onmouseleave="taskContactListDrobdownClose()">
                                                    <div class="task_input_section_ol">
                                                        <input type="text" id="taskDropDownInput" class="task_dropdown_input_ol" tabindex="3"
                                                            placeholder="Select contacts to assign" onclick="taskContactListDrobdown()"
                                                            onkeyup="taskContactFilterList()">
                                                        <img src="../assets/icons/arrow_down.svg">
                                                    </div>
                                                    <div id="taskContactDrowdownMenue" class="task_dropdown_content_ol">
                                                        <div id="taskDropDownList" class="task_dropdown_list_ol">
                                                        </div>
                                                    </div>
                                                </div>
                                                    <div id="initialeIconList" class="initiale_Icon_List_ol icon_List_hide">
                                                    </div>
                                     </div>

                                     <div class="required_text_ol">
                                           <span><span class="star_red_ol">*</span class="required-text_ol">This field is requiered</span>
                                     </div>


                                 </div>


                                   <div class="hr_ol">
                                     <hr>
                                   </div>
                        


                                 <div class="section_right_ol">


                                     <div class="section_date_div_ol">
                                            <h2>Due date<span class="star_red_ol">*</span></h2>
                                            <div class="date_input_ol">
                                            <input type="date" id="taskDate" class="date_input_field_ol"  onblur="requiredInputDate()" onchange="requiredInputDate()" onfocus="errorFieldsFocus('error_Field_Date')"  tabindex="4">
                                            <img src="../assets/icons/event.png" class="date_icon_ol" onclick="openDatePicker()">
                                            </div>
                                              <span id="error_Field_Date" class="error_Field">&nbsp;</span>         
                                      </div>
                                    

                                  <div class="section_prio_ol">
                                            <h2>Priority</h2>
                                        <div class="prio_buttons">
                                        
                                            <button onclick="btnPrioSelect('urgent')" class="btn_prio button-urgent"
                                                tabindex="5">Urgent
                                                <img class="prio_img" src="../assets/icons/high_prio.svg" alt="urgent">
                                            </button>
                                        
                                            <button onclick="btnPrioSelect('medium')" class="btn_prio button_medium"
                                                tabindex="6">Medium
                                                <div id="btnPrioGroup" class="prio_img prio_img_group">
                                                    <img src="../assets/icons/linePrio.svg">
                                                    <img src="../assets/icons/linePrio.svg">
                                                </div>
                                            </button>
                                        
                                            <button onclick="btnPrioSelect('low')" class="btn_prio button-low" tabindex="7">Low
                                                <img class="prio_img" src="../assets/icons/low_prio.svg">
                                            </button>
                                         </div>
                                  </div>

                                <div class="section_category_ol">
                                    <h2>Category<span class="star_red_ol">*</span></h2>
                                    <div class="category-wrapper_ol">
                                        <select id="taskCatergory" class="input_field_catergory_ol" onblur="requiredInputCategory()" onfocus="errorFieldsFocus('error_Field_Catergory')"onclick="requiredInputCategory()" >
                                            <option value="" selected disabled>Select task category</option>
                                            <option value="1">Technical Task</option>
                                            <option value="2">User Story</option>
                                        </select>
                                       <span id="error_Field_Catergory" class="error_Field">&nbsp;</span>  
                                    </div>
                                </div>

                               <div class="section_subtasks_ol">
                                        <h2>Subtasks</h2>
                                    <div class="input_wrapper_ol">
                                        <div class="input_group_ol">
                                        <input type="text" id="inputSubtask" class="input_subtasks_ol"
                                            oninput="subTaskInputCheck()" maxlength="40">
                                            <img id="subTaskAddIcon" class="add_subtasks_new_ol ele_hide"
                                            onclick="subTaskInputCheck(true)" src="../assets/icons/add.png" alt="add-icon">
                                    
                                            <div id="subTaskEditIocn" class="add_subtasks_ol sub_Task_Edit_Iocn_ol ele_hide">
                                                <img id="subTaskCloseIcon" onclick="subTaskClose()" src="../assets/icons/close.svg"
                                                    alt="add-icon">
                                                <img src="../assets/icons/vectorV.svg">
                                                <img id="subTaskCheckIcon" onclick="taskCreateTask()"
                                                    src="../assets/icons/checkSW.svg" alt="add-icon">
                                            </div>
                                        </div>
                           
                                    </div>
                                           <div id="subTaskList" class="subtask_list_ol">
                                    </div>
                                </div>
                    

                                            <div class="button_bottom_task_ol">
                                                <button id="btnClearTask" class="button_clear_task" onclick="addTaskClear()">Clear <img
                                                        class="cancel_ol" src="../assets/icons/iconoir_cancel.png" alt=""></button>
                                                <button id="btnCreateTask" class="button_create_task" onclick="checkInputData('overlay')">Create Task
                                                    <img src="../assets/icons/check.png" alt=""></button>
                                            </div>
                             </div>




                                <div class="required_text_mobile_ol">
                                    <span><span class="star_red_ol ">*</span class="required-text_ol">This field is requiered</span>
                                </div>

               
                                <div id="notificationFinish" class="message_Finish_ol">
                                    <div class="message_Finish_contents_ol">
                                        <p>Task added to board</p>
                                        <img src="../assets/icons/boardIcon.svg">
                                    </div>
                                </div>

                       </div>  
      
        
                         <div class="button_bottom_task_mobile_ol">
                              <button id="btnClearTask" class="button_clear_task" onclick="addTaskClear()">Clear <img
                              class="cancel_ol" src="../assets/icons/iconoir_cancel.png" alt=""></button>
                              <button id="btnCreateTaskMobile" class="button_create_task" onclick="checkInputData('overlay')">Create Task
                              <img src="../assets/icons/check.png" alt=""></button>
                         </div>
                      

        </div> 
      </div>
    `
}
