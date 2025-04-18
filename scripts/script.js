let contactColorArray = [ 
  "#FC71FF", //pink
  "#6E52FF", //bluish-purple
  "#9327FF", //ligh purple
  "#FFBB2B", //yellow
  "#FF4646", //red       
  "#00BEE8", //light blue / mint
  "#0038FF", //dark blue
  "#FF7A00", //orange
  "#1FD7C1", //turquoise
  "#462F8A", //dark purple
  "#6e6b6dcc", //grey
];


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
          const initials = getCurrentInitials(userName);
          document.getElementById('render_initials_user_logo').textContent = initials;
      })
      .catch(err => console.error("Fehler beim Abrufen des Namens:", err)); 
}


function getCurrentInitials(name) {
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
    
