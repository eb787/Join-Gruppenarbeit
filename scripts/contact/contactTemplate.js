function contactCardScrollList(user) {
    return `
        <div class="contact_Detail_List">
            <h4 class="contact_abbreviation">${user.name.charAt(0).toUpperCase()}${user.name.charAt(1).toUpperCase()}</h4>
            <div>
                <h2 class="contact_name">${user.name}</h2>
                <h3 class="contact_mail color_font">${user.email}</h3>
            </div>
        </div>
    `;
}



function contactCardMiddle() {
    return`
    <div class="contact_Detail_Frame">
                            <h4 class="contact_Detail_abbreviation">AM</h4>
                            <div class="contact_Detail_Name_Frame">
                                <p3 class="contact_Detail_Name">Anton Mayer</p3>
                                <div class="contact_Detail_Menu">
                                    <span onclick = "editContact()" ><img src="../assets/icons/edit.svg">Edit</span>
                                    <span onclick = "deleteContactBigMiddle()"><img src="../assets/icons/delete.svg">Delete</span>
                                </div>
                            </div>
                        </div>
                        <h2 class="contact_Detail_Info_Header">Contact Information</h2>
                        <div class="contact_Detail_Info_Mail">
                            <h3>Email</h3>
                            <h3 class="color_font font_weight_400">anton@gmail.com</h3>
                        </div>
                        <div class="contact_Detail_Info_Phone">
                            <h3>Phone</h3>
                            <h3 class=" font_weight_400">+49 1111 111 11 1</h3>
                        </div>
                        `
}
