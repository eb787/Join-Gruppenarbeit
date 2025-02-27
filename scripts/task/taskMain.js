let taskArray=[];
let taskContacteArray=[];
let taskSubTaskArray=[];



//Start function
window.onload= function init(){
   
  startAddTask();
    console.log("Starte task");
    loadDataFirebase();
    // taskRenderContact();
    requiredInputAddTask();
    openDatePicker();

}

/*Tasten Clear und Create Task sperren*/ 
function startAddTask(){
  document.getElementById('btnCreateTask').classList.add('btn_lockout');
  document.getElementById('btnClearTask').classList.add('btn_lockout');
}



//Felder prüfen ob Eingabe erfolgte mit QuerySelector
function  requiredInputAddTask(){
  document.querySelectorAll(".input-field").forEach(input =>{
      input.addEventListener("blur",function(){
        let errorMsg= this.nextElementSibling;
        if (this.value.trim()===""){
        errorMsg.textContent="This field is required";
          console.log("Fehler");
               }else{
          errorMsg.textContent=" ";
          console.log("Kein Fehler");
        }
      })
  })
}


//Datum Picker öffnen
function openDatePicker() {
  document.querySelector(".date-icon").addEventListener("click", function () {
    let dateInput = document.querySelector(".date-input");
           
    if (dateInput.showPicker) {
        dateInput.showPicker(); // Moderne Browser
    } else {
        dateInput.focus(); // Fallback für ältere Browser
    }
    
});
}


function btnPrioSelect(btnPrio){
  document.querySelectorAll('.btn_prio').forEach(button => {
    button.style.backgroundColor = "white";
    button.style.color="black";
});


if(btnPrio=="urgent"){
  btnPrioBtnSelect("button-urgent","#FF3D00",0)
}
if(btnPrio=="medium"){
  btnPrioBtnSelect("button-medium","#FFA800",1)
}
if(btnPrio=="low")  {
  btnPrioBtnSelect("button-low","#7AE229",2)
}
}


function btnPrioBtnSelect(auswahl,btnColor){
  Object.assign(document.getElementsByClassName(auswahl)[0].style,{
    backgroundColor:btnColor,
    color:"white",
   })
   //document.getElementsByClassName('prio_urgent_img')[id].style.filter = "brightness(0) invert(1)";

   document.querySelectorAll(".prio_urgent_img").forEach(el=>{
    el.classList.toggle('prio_img_with');
   })

}







function taskReadinArray(taskData){
    console.log("Einträge ",Object.values(taskData).length);
    console.log("Category ",taskData[0].category);
    console.log("deadline ",taskData[0].deadline);

     let contactArray=taskData[0].contacts.map(task=>task);

    console.log("Anzahl der Kontake ",contactArray.length);
     console.log("Kontake ",contactArray);   
     console.log("Kontakt 1" ,contactArray[0])

   } 




   function contactReadinArray(){

   }













