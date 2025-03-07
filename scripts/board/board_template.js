function getExampleCard(index, subtasks, progress) {
    return `<div class="card" onclick="showCardOverlay(${index})" draggable="true" ondragstart="startDragging(${index})">
                                <div id="category_${index}" class="task_category technical_task">${currentTasks[index].category}</div>
                                <div>
                                    <div class="task_name">${currentTasks[index].title}</div>
                                    <div id="description_${index}" class="task_description">${currentTasks[index].description}...</div>
                                </div>
                                <div id="subtasks_${index}" class="progress_box">
                                    <div class="progress_bar">
                                        <div id="progress_${index}" class="progress" style="width: ${progress}%;"></div>
                                    </div>
                                    <div style="display: flex; flex-direction: row; gap: 1px; align-items: center;">
                                        <h4 id="subtasks_done" style="font-weight: 400;">${currentTasks[index].subtasks.number_of_finished_subtasks}</h4>
                                        <h4 style="font-weight: 400;">/</h4>
                                        <h4 id="subtasks_total" style="font-weight: 400;">${subtasks}</h4><br><br>
                                        <h4 style="font-weight: 400;">Subtasks</h4>
                                    </div>
                                    
                                </div>
                                <div class="card_footer">
                                    <div id="Profile_badges_${index}" class="profile_badges">
                                        
                                    </div>
                                    <img class="prio_icon ${currentTasks[index].prio}" src="..//assets/icons/${currentTasks[index].prio}.svg" alt="priority indicator">
                                </div>
                                
        
                            </div>`
}

function getContactIcon() {
    return  `   <div id="profile_orange" class="profile_badge profile_orange first_profile">AM</div>
                <div id="profile_green" class="profile_badge profile_green second_profile">EM</div>
                <div id="profile_purple" class="profile_badge profile_purple third_profile">MB</div>
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
    return `    <div onclick="closeOverlay()" id="bg_overlay" class="bg_overlay d_none">
                <div onclick="stopPropagation(event)" id="card_overlay" class="card_overlay">
                    
                            </div>
                                </div>`
}

function getCardOverlayContent(index) {
    return `   
   
        <div class="card_overlay_header">
            <div id="category_overlay${index}" class="task_category task_category_overlay technical_task_overlay ">${currentTasks[index].category}</div>
            <img onclick="closeOverlay()" class="close_btn_overlay" src="..//assets/icons/close.svg" alt="close button">
        </div>
                        <h1 class="board_heading">${currentTasks[index].title}</h1>
                        <div class="task_description_overlay">${currentTasks[index].description}</div>
                        <div class="task_description_overlay">
                            <p class="color_blue">Due Date:</p>
                           <p>10/05/2025</p>
                        </div>
                         <div class="task_description_overlay">
                            <p class="color_blue al_center">Priority:</p>
                           <p class="priority_div">Medium<img class="prio_icon ${currentTasks[index].prio}" src="..//assets/icons/${currentTasks[index].prio}.svg" alt="priority indicator"></p>
                           
                        </div>
                        <div class="task_description_overlay fd_column gap_8">
                            <p class="color_blue">Assigned To:</p>
                            <div>
                                <div class="contact_info">
                                    <div class="profile_badge profile_badge_overlay profile_orange">AM</div>
                                    <p class="font_19">Emanuel Macron</p>
                                </div>
                                 <div class="contact_info">
                                    <div class="profile_badge profile_badge_overlay profile_green">EM</div>
                                    <p class="font_19">Boris Becker</p>
                                 </div>
                                 <div class="contact_info">
                                    <div class="profile_badge profile_badge_overlay profile_purple">MB</div>
                                    <p class="font_19">Angela Merkel</p>
                                 </div>
                            </div>
                        </div>
                        <div class="task_description_overlay fd_column gap_8">
                            <p class="color_blue">Subtasks</p>
                            <div>
                                <div class="task_info">
                                    <div class="check_box_overlay"></div>
                                    <p class="font_16">Emanuel Macron</p>
                                </div>
                                 <div class="task_info">
                                    <div class="check_box_overlay"></div>
                                    <p class="font_16">Boris Becker</p>
                                 </div>
                            </div>
                        </div>
                        <div  class="overlay_options">
                            <div class="overlay_option delete_btn_overlay_board">
                                <img class="delete_icon" src="..//assets/icons/delete.svg" alt="delete button">
                                <p>Delete</p>
                            </div>
                            <div class="seperator_overlay_options"></div>
                            <div class="overlay_option edit_btn_overlay_board">
                                <img class="edit_icon" src="..//assets/icons/edit.svg" alt="edit button">
                                <p>Edit</p>
                            </div>
                        </div>
               `

}



function getUserStoryCard() {
    return `<div class="card" draggable="true">
                                <div class="task_category user_story">User story</div>
                                <div>
                                    <div class="task_name">Kochwelt Page & Recipe Recommender</div>
                                    <div class="task_description">Build start page with recipe recommendation...</div>
                                </div>
                                <div class="progress_box">
                                    <div class="progress_bar">
                                        <div class="progress" style="width: 50%;"></div>
                                    </div>
                                    <div style="display: flex; flex-direction: row; gap: 1px; align-items: center;">
                                        <h4 id="subtasks_done" style="font-weight: 400;">1</h4>
                                        <h4 style="font-weight: 400;">/</h4>
                                        <h4 id="subtasks_total" style="font-weight: 400;">2</h4><br><br>
                                        <h4 style="font-weight: 400;">Subtasks</h4>
                                    </div>
                                    
                                </div>
                                <div class="card_footer">
                                    <div class="profile_badges">
                                        <div id="profile_orange" class="profile_badge profile_orange first_profile">AM</div>
                                        <div id="profile_green" class="profile_badge profile_green second_profile">EM</div>
                                        <div id="profile_purple" class="profile_badge profile_purple third_profile">MB</div>
                                    </div>
                                    <img class="prio_icon" src="..//assets/icon/medium_prio.png" alt="medium priority">
                                </div>
                                
        
                            </div>`
}

function getUserStoryCard2() {
    return `<div class="card" draggable="true">
                                    <div class="task_category user_story">User story</div>
                                    <div>
                                        <div class="task_name">Kochwelt Page & Recipe Recommender</div>
                                        <div class="task_description">Build start page with recipe recommendation...
                                        </div>
                                    </div>
                                    <div class="progress_box">
                                        <div class="progress_bar">
                                            <div class="progress" style="width: 50%;"></div>
                                        </div>
                                        <div style="display: flex; flex-direction: row; gap: 1px; align-items: center;">
                                            <h4 id="subtasks_done" style="font-weight: 400;">1</h4>
                                            <h4 style="font-weight: 400;">/</h4>
                                            <h4 id="subtasks_total" style="font-weight: 400;">2</h4><br><br>
                                            <h4 style="font-weight: 400;">Subtasks</h4>
                                        </div>

                                    </div>
                                    <div class="card_footer">
                                        <div class="profile_badges">
                                            <div id="profile_orange" class="profile_badge profile_orange first_profile">
                                                AM</div>
                                            <div id="profile_green" class="profile_badge profile_green second_profile">
                                                EM</div>
                                            <div id="profile_purple" class="profile_badge profile_purple third_profile">
                                                MB</div>
                                        </div>
                                        <img class="prio_icon" src="..//assets/icons/medium_prio.png"
                                            alt="medium priority">
                                    </div>


                                </div>`
}





function getEmptyCard() {return `<div class="board_content_box" id="toDo" ondrop="moveTo(id)" ondragover="allowDrop(event)">
                                <div class="no_tasks">No tasks To do</div>
                            </div>`}

                                



function getTechnicalTaskCard() {return `<div class="card" draggable="true">
                                    <div class="task_category technical_task">Technical Task</div>
                                    <div>
                                        <div class="task_name">HTML Base Template Creation</div>
                                        <div class="task_description">Create reusable HTML base templates...</div>
                                    </div>
                                    <div class="card_footer">
                                        <div class="profile_badges">
                                            <div id="profile_pink" class="profile_badge profile_pink first_profile">DE
                                            </div>
                                            <div id="profile_blue" class="profile_badge profile_blue second_profile">BZ
                                            </div>
                                            <div id="profile_lightpurple"
                                                class="profile_badge profile_lightpurple third_profile">AS</div>
                                        </div>
                                        <img class="prio_icon prio_low" src="..//assets/icons/low_prio.png"
                                            alt="low priority">
                                    </div>


                                </div>`}


                            






function getUserStoryCard3() {return `<div class="card" draggable="true">
                                    <div class="task_category user_story">User story</div>
                                    <div>
                                        <div class="task_name">Daily Kochwelt Recipe</div>
                                        <div class="task_description">Implement daily recipe and portion calculator...
                                        </div>
                                    </div>
                                    <div class="card_footer">
                                        <div class="profile_badges">
                                            <div id="profile_yellow" class="profile_badge profile_yellow first_profile">
                                                EF</div>
                                            <div id="profile_lightpurple"
                                                class="profile_badge profile_lightpurple second_profile">AS</div>
                                            <div id="profile_red" class="profile_badge profile_red third_profile">TW
                                            </div>
                                        </div>
                                        <img class="prio_icon" src="..//assets/icons/medium_prio.png"
                                            alt="medium priority">
                                    </div>
                                </div>`}

                                




function getTechnicalTask2() {return `<div class="card" draggable="true">
                                    <div class="task_category technical_task">Technical Task</div>
                                    <div>
                                        <div class="task_name">CSS Architecture Planning</div>
                                        <div class="task_description">Define CSS naming conversations and structure...
                                        </div>
                                    </div>
                                    <div class="progress_box">
                                        <div class="progress_bar">
                                            <div class="progress" style="width: 100%;"></div>
                                        </div>
                                        <div style="display: flex; flex-direction: row; gap: 1px; align-items: center;">
                                            <h4 id="subtasks_done" style="font-weight: 400;">2</h4>
                                            <h4 style="font-weight: 400;">/</h4>
                                            <h4 id="subtasks_total" style="font-weight: 400;">2</h4><br><br>
                                            <h4 style="font-weight: 400;">Subtasks</h4>
                                        </div>

                                    </div>
                                    <div class="card_footer">
                                        <div class="profile_badges">
                                            <div id="profile_turquoise"
                                                class="profile_badge profile_turquoise first_profile">SM</div>
                                            <div id="profile_blue" class="profile_badge profile_blue second_profile">BZ
                                            </div>
                                        </div>
                                        <img class="prio_icon" src="..//assets/icons/medium_prio.png"
                                            alt="medium priority">
                                    </div>
                                </div>`}


                                