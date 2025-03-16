function getExampleCard(index, layer) {
    return `<div id="card_number_${index}" class="card" onclick="showCardOverlay(${index})" draggable="true" ondragstart="startDragging(${index}, event)">
                                <div id="category_${index}_${layer}" class="task_category technical_task">${currentTasks[index].category}</div>
                                <div>
                                    <div class="task_name">${currentTasks[index].title}</div>
                                    <div id="description_${index}_${layer}" class="task_description">${currentTasks[index].description.slice(0, 50)}...</div>
                                </div>
                                <div id="subtasks_box${index}_${layer}">
                                </div>
                                <div class="card_footer">
                                    <div id="Profile_badges_${index}_${layer}" class="profile_badges">
                                        
                                    </div>
                                    <img class="prio_icon ${currentTasks[index].prio}_${layer}" src="..//assets/icons/${currentTasks[index].prio}.svg" alt="priority indicator">
                                </div>
                                
        
                            </div>`
}

function getSubtasks(index, subtasks, progress, layer) {
    return `
    <div id="subtasks_${index}_${layer}" class="progress_box">
                                    <div class="progress_bar">
                                        <div id="progress_${index}_${layer}" class="progress" style="width: ${progress}%;"></div>
                                    </div>
                                    <div style="display: flex; flex-direction: row; gap: 1px; align-items: center;">
                                        <h4 id="subtasks_done" style="font-weight: 400;">${currentTasks[index].subtasks.number_of_finished_subtasks}</h4>
                                        <h4 style="font-weight: 400;">/</h4>
                                        <h4 id="subtasks_total" style="font-weight: 400;">${subtasks}</h4><br><br>
                                        <h4 style="font-weight: 400;">Subtasks</h4>
                                    </div>
                                    
                                </div>
    
    `

}

function getContactIcon(index, i, layer) {
    return `   <div id="profile_${index}_${i}_${layer}" class="profile_badge" style="z-index: ${i + 1}; position: relative; left: calc(${i} * -8px); background-color: ${contactColorArray[currentTasks[index].contacts[i].color]};"></div>  
    `

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

function getCardOverlay() {
    return `    <div onclick="closeOverlay('bg_overlay')" id="bg_overlay" class="bg_overlay d_none">
                <div onclick="stopPropagation(event)" id="card_overlay" class="card_overlay">
                    
                            </div>
                                </div>`
}

function getCardOverlayContent(index) {
    return `   
      
        <div class="card_overlay_header">
            <div id="category_overlay${index}" class="task_category task_category_overlay technical_task_overlay ">${currentTasks[index].category}</div>
            <img onclick="closeOverlay('bg_overlay')" class="close_btn_overlay" src="..//assets/icons/close.svg" alt="close button">
        </div>
                        <h1 class="board_heading">${currentTasks[index].title}</h1>
                        <div class="task_description_overlay">${currentTasks[index].description}</div>
                        <div class="task_description_overlay">
                            <p class="color_blue">Due Date:</p>
                           <p>${currentTasks[index].deadline}</p>
                        </div>
                         <div class="task_description_overlay">
                            <p class="color_blue al_center">Priority:</p>
                           <div class="priority_div"><div id="prio_text_${index}">Medium</div><img class="prio_icon" src="..//assets/icons/${currentTasks[index].prio}.svg" alt="priority indicator"></div>
                           
                        </div>
                        <div id="task_description_overlay_${index}" class="task_description_overlay fd_column gap_8">
                            
                        </div>
                        <div id="subtasks_box_overlay${index}">
                        </div>
                        <div  class="overlay_options">
                            <div onclick="deleteTask(${index})" class="overlay_option delete_btn_overlay_board">
                                <img class="delete_icon" src="..//assets/icons/delete.svg" alt="delete button">
                                <p>Delete</p>
                            </div>
                            <div class="seperator_overlay_options"></div>
                            <div onclick="editTask(${index})" class="overlay_option edit_btn_overlay_board">
                                <img class="edit_icon" src="..//assets/icons/edit.svg" alt="edit button">
                                <p >Edit</p>
                            </div>
                        </div>
               `

}

function getSubtasksOverlay(index) {
    return `
    <div class="task_description_overlay fd_column gap_8">
                            <p class="color_blue">Subtasks</p>
                            <div id="tasks_box${index}"> 
                            </div>
                        </div>
    
    `
}

function getTaskOverlay(index, i) {
    return `
                             <div id="check_box_${index}_info${i}" onclick="changeSubtaskCategory(${index}, ${i})" class="task_info">
                                    <div id="check_box_${index}_btn${i}" class="check_box_btn"></div>
                                    <p class="font_16">${Object.keys(currentTasks[index].subtasks.subtasks_todo)[i]}</p>
                                </div>
    
    `
}

function getContactBoxOverlay(index) {
    return `
    <p class="color_blue">Assigned To:</p>
                            <div id="profile_badges_overlay${index}">
                                
                            </div>
    
    
    `
}

function getContactIconOverlay(index, i) {
    return `   <div class="contact_info">
                    <div id="profile_badge_overlay_${index}_${i}"  class="profile_badge profile_badge_overlay" style="background-color: ${contactColorArray[currentTasks[index].contacts[i].color]};">
                    </div>
                    <p class="font_19">${currentTasks[index].contacts[i].name}
                    </p>
                </div>
   
    `
}


// Ab hier Edit Task Template

function editTaskTemplate(index) {
    console.log("Gebe Currentaskaus ",currentTasks[index]);
    //btnPrioSelect('urgent');    

    return `
        <div class="card_overlay_header">
            <div id="category_overlay${index}" class="task_category task_category_overlay  "></div>
            <img onclick="closeOverlay('bg_overlay')" class="close_btn_overlay" src="..//assets/icons/close.svg" alt="close button">
        </div>

 
            <form>
                <div class="section-title-div">
                    <span class="title">Title</span>
                    <input id="taskTitle" class="input-title input-field" type="text" value="${currentTasks[index].title}" tabindex="1">
                    <span class="error_Field">&nbsp;</span>
                </div>
            </form>

            <div class="section-description">
                <span>Description</span>
                <div class="textarea-description">
                    <textarea id="descriptionTask"  placeholder="Enter a Description" tabindex="2">${currentTasks[index].description}</textarea>
                </div>
            </div>

        

            <div class="section-date-div">
                <span class="star-red">Due date </span>
               <div class="task_Date_Input_Div">
                   <input type="date" value="${dateConversation(currentTasks[index].deadline)}" id="taskDate" class="date_input input-field" tabindex="4" >
                   <img src="../assets/icons/event.png" class="date-icon"  onclick="openDatePicker()" >
                </div>
                <span class="error_Field">&nbsp;</span>
            </div>
          


            <div class="section-prio">
                <span>Priority</span>



                <div class="prio-buttons">
                       <button onclick="btnPrioSelect('urgent')" class="btn_prio button-urgent" tabindex="5">Urgent
                       <img class="prio_img" src="../assets/icons/high_prio.svg" alt="urgent">
                    </button>
                  

                    <button onclick="btnPrioSelect('medium')" class="btn_prio button-medium" tabindex="6">Medium
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




            <div class="section-assigned">
                <span class="assigned-title">Assigned to</span>
                <div class="task_Contact_dropdown">

                    <div class="task_input_section">
                        <input type="text" id="taskDropDownInput" class="task_dropdown_input" tabindex="3"
                            placeholder="Select contacts to assign" onclick="taskContactListDrobdown1()"
                            onkeyup="taskContactFilterList1()">
                        <img src="../assets/icons/arrow_down.svg" >
                    </div>

                    <div id="taskContactDrowdownMenue" class="task_dropdown_content">
                        <div id="taskDropDownList" class="task_dropdown_list">
                        </div>
                    </div>
                </div>
            </div>

            <div id="initialeIconList" class="initiale_Icon_List icon_List_hide">
                
            </div>


            <div>
                <span>Subtasks</span>
                <div class="input-wrapper">
                    <input type="text" id="inputSubtask" class="input-subtasks" oninput="subTaskInputCheck()"
                        maxlength="40">
                    <span class="error_Field">&nbsp;</span>
                    <img id="subTaskAddIcon" class="add-subtasks ele_hide" onclick="subTaskInputCheck(true)"
                        src="../assets/icons/add.png" alt="add-icon">
                </div>
                    <div id="subTaskEditIocn" class="add-subtasks sub_Task_Edit_Iocn ele_hide">
                        <img id="subTaskCloseIcon" onclick="subTaskClose()" src="../assets/icons/close.svg"
                            alt="add-icon">
                        <img src="../assets/icons/vectorV.svg">
                        <img id="subTaskCheckIcon" onclick="taskCreateTask()" src="../assets/icons/checkSW.svg"
                            alt="add-icon">
                    </div>
                        <div id="subTaskList" class="subtask_list"></div>
                    </div>   
               
                
                <div class="btn_div">
                    <button class="button_Ok">OK  <img src="../assets/icons/check.svg"></button>
                </div>
                     
    </div>
   `

}

function getFoundItems() {

    return ` <h1 class="board_heading heading_extra">Search results</h1>

    <div id="found_titles" class="found_titles"></div>
      
    
    `
}



function dateConversation(dateStr){
    let parts = dateStr.split("/"); // Teilt das Datum in ["13", "03", "25"]
    let day = parts[0];
    let month = parts[1];
    let year = "20" + parts[2]; // "25" -> "2025"
    return `${year}-${month}-${day}`;
}



function getAddTaskOverlay() {
    return `    <div onclick="closeOverlay('addTask_overlay')" id="addTask_overlay" class="bg_overlay d_none">
                <div onclick="stopPropagation(event)" id="addTask_card" class="addTask_overlay">
                <img onclick="closeOverlay('addTask_overlay')" class="close_btn_overlay" style="width: 100px;" src="..//assets/icons/close.svg" alt="close button">
                    
                            </div>
                                </div>`
}
