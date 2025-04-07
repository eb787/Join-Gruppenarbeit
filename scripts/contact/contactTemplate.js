function contactCardScrollList(newContact, contactsId, color, letter) {
    let nameParts = newContact.name.trim().split(" ");
    let initials = nameParts[0].charAt(0).toUpperCase();
    let backgroundColor = color || "#ccc";
    if (nameParts.length > 1) {
        initials += nameParts[1].charAt(0).toUpperCase();
    }
    return `
        <div class="contact_Detail_List" id="contact-card-${contactsId}" onclick="openContactBigMiddle('${contactsId}',letter)">
            <h4 class="contact_abbreviation" style="background-color:${backgroundColor};">${initials}</h4>
            <div>
                <h2 class="contact_name" id = "contact_name_id_${contactsId}">${newContact.name}</h2>
                <h3 class="contact_mail color_font" id = "contact_email_one_${contactsId}">${newContact.email}</h3>
            </div>
        </div>
    `;
}


function contactCardMiddle(user, contactIndex, firstLetter, color) {
    let nameParts = user.name.trim().split(" ");
    let initials = nameParts[0].charAt(0).toUpperCase();
    let backgroundColor = color || "#ccc";
    if (nameParts.length > 1) {
        initials += nameParts[1].charAt(0).toUpperCase();
    }
    return `
    <div class = "background_close" onclick = closeWindowMobile()>
        <div class="contact_Detail_Frame" >
            <h4 class="contact_Detail_abbreviation" style="background-color: ${backgroundColor};">${initials}</h4>
            <div class="contact_Detail_Name_Frame">
                <p class="contact_Detail_Name" id = "contact_name_one_${contactIndex}">${user.name}</p>
                <div class="contact_Detail_Menu">
                    <span onclick="editContact('${contactIndex}', '${firstLetter}','${color}')"><img src="../assets/icons/edit.svg"> Edit</span>
                    <span onclick="deleteContact('${contactIndex}', '${firstLetter}')"><img src="../assets/icons/delete.svg"> Delete</span>
                </div>
            </div>
        </div>
        <h2 class="contact_Detail_Info_Header">Contact Information</h2>
        <div class="contact_Detail_Info_Mail">
            <h3>Email</h3>
            <h3 class="color_font font_weight_400" id = "contact_email_${contactIndex}">${user.email}</h3>
        </div>
        <div class="contact_Detail_Info_Phone">
            <h3>Phone</h3>
            <h3 class="font_weight_400" id ="contact_tel_${contactIndex}">${user.number}</h3>
        </div>
        </div>
            <div class = "mobile_button_options_div">
                <img src="../assets/icons/Menu Contact options.png" alt="mobile-options" class="mobile_options" onclick = "openWindowMobile('${contactIndex}','${firstLetter}','${color}')">
                <div id ="mobile_window"></div>
                </div>
    `;
}


function contactcardHeadline(mode) {
    let headline = document.getElementById('headline');
    headline.innerHTML = cardNewContact(mode);
}


function cardNewContact(mode) {
    let title = mode === "edit" ? "Edit Contact" : "Add Contact";
    let text = "Task are better with a team!"
    return `
        <div class = "close_button_mobile_div">
            <img src="../assets/icons/Close.png" alt="close_button" class="close_button_mobile" onclick="clearInputsAndClose()">
        </div>
            <img src="../assets/icons/logocontact.svg" class = "logo_mobile">
            <p>${title}</p>
            <span>${text}</span>
            <hr class= "line_contact">
    `;
}


function contactcardHeadlineEdit() {
    let headline = document.getElementById('headline');
    headline.innerHTML = cardNewContactEdit();
}


function cardNewContactEdit() {
    let title = "Edit Contact";
    return `   <div class = "close_button_mobile_div">
            <img src="../assets/icons/Close.png" alt="close_button" class="close_button_mobile" onclick="clearInputsAndClose(); closeEditMobile();">
        </div>
            <img src="../assets/icons/logocontact.svg " class = "logo_mobile">
            <p>${title}</p>
    `;
}


function alertSuccess() {
    return `
    <div id ="alert">
        <div class="alert_div">
            <p class="alert_text">Contact succesfully created</p>  
        </div>
    </div>`
}



