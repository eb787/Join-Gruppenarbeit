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