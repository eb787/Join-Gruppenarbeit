/**
 * This function is used to log in a guest user
 * It checks if the user is already logged in and sets necessary flags in localStorage
 * Sets the user login status and greeting flag for the guest
 */
async function guestLogin() {
    if (localStorage.getItem('userLoggedIn') === 'true') {
        console.log("The user is already logged in.");
        return; 
    }
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('greetingShown', 'false');
    
    openGuestLoginPage();
}


/**
 * This function opens the guest login page by redirecting the browser
 * @throws {Error} Throws an error if the URL is invalid
 */
function openGuestLoginPage() {
    try {
        const url = "./HTML/summary_guest.html";
        if (url) {
            window.location.href = url; 
        } else {
            throw new Error('Invalid URL'); 
        }
    } catch (error) {
        console.error("Error during redirection:", error);
    }
}


