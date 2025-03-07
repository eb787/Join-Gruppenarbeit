function contactCardScrollList(newContact, contactsId) {
    let nameParts = newContact.name.trim().split(" "); 
    let initials = nameParts[0].charAt(0).toUpperCase(); 

    if (nameParts.length > 1) {
        initials += nameParts[1].charAt(0).toUpperCase(); 
    }

    return `
    
        <div class="contact_Detail_List" id="contact-card-${contactsId}" onclick="openContactBigMiddle('${contactsId}')">
            <h4 class="contact_abbreviation">${initials}</h4>
            <div>
                <h2 class="contact_name">${newContact.name}</h2>
                <h3 class="contact_mail color_font">${newContact.email}</h3>
            </div>
        </div>
    `;
}



function contactCardMiddle(user, contactIndex, firstLetter) {
    return `
    <div class="contact_Detail_Frame">
            <h4 class="contact_Detail_abbreviation">${user.name.charAt(0).toUpperCase()}${user.name.charAt(1).toUpperCase()}</h4>
                            <div class="contact_Detail_Name_Frame">
                <p class="contact_Detail_Name">${user.name}</p>
                                <div class="contact_Detail_Menu">
                    <span onclick="editContact('${contactIndex}', '${firstLetter}')"><img src="../assets/icons/edit.svg"> Edit</span>
                    <span onclick="deleteContact('${contactIndex}', '${firstLetter}')"><img src="../assets/icons/delete.svg"> Delete</span>
                                </div>
                            </div>
                        </div>
                        <h2 class="contact_Detail_Info_Header">Contact Information</h2>
                        <div class="contact_Detail_Info_Mail">
                            <h3>Email</h3>
            <h3 class="color_font font_weight_400">${user.email}</h3>
                        </div>
                        <div class="contact_Detail_Info_Phone">
                            <h3>Phone</h3>
            <h3 class="font_weight_400">${user.number}</h3>
                        </div>
    `;
}
