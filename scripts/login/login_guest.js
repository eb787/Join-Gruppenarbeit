async function guestLogin() {
    if (!localStorage.getItem('userLoggedIn')) {
        localStorage.setItem('userLoggedIn', 'true');
    }
    if (!localStorage.getItem('greetingShown')) {
        localStorage.setItem('greetingShown', 'false');
    }
    openGuestLoginPage();
}


function openGuestLoginPage() {
    try {
        const url = "../HTML/summary_guest.html";
        if (url) {
            window.location.href = url;
        } else {
            throw new Error('Ungültige URL');
        }
    } catch (error) {
        console.error("Fehler bei der Weiterleitung:", error);
    }
}


async function guestLogin() {
    if (localStorage.getItem('userLoggedIn') === 'true') {
        console.log("Der Benutzer ist bereits eingeloggt.");
        return; 
    }
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('greetingShown', 'false');
    openGuestLoginPage();
}

