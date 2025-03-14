const contactColorArray = [
    " #1FD7C1",
    " #462F8A",
    " #FC71FF",
    " #6E52FF",
    " #9327FF",
    " #FFBB2B",
    " #FF4646",
    " #00BEE8",
    " #FF7A00",
     "#040404"
]

function toggleMenu() {
    document.getElementById('submenu_toogle').classList.toggle('submenu_open');
  }
  
  document.addEventListener('click', function(event) {
    const submenu = document.getElementById('submenu_toogle');
    const toggleButton = document.getElementById('logo_user_sign_in');
  
    if (!submenu.contains(event.target) && !toggleButton.contains(event.target)) {
      submenu.classList.remove('submenu_open'); 
    }
  });
  

function renderInitials() {
  const Base_URL = "https://joinstorage-805e6-default-rtdb.europe-west1.firebasedatabase.app/";
  renderUserLogo()

  fetch(`${Base_URL}/currentUser.json`)
      .then(res => res.json())
      .then(data => {
          const userName = data.name; 
          const initials = getInitials(userName);
          
          document.getElementById('render_initials_user_logo').textContent = initials;
      })
      .catch(err => console.error("Fehler beim Abrufen des Namens:", err));
}

function getInitials(name) {
    const nameParts = name.split(" ");
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
}

function renderUserLogo(){
    document.getElementById("logo_user_sign_in").innerHTML = addUserLogoTemplate();
    }

function addUserLogoTemplate(){
    return ` 
        <div class="user_logo">
        <div id="render_initials_user_logo"> </div>
        </div>
    `
}
