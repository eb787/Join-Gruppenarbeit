
 //Ab hier Task Edit
console.log("taskEdit.js");

 function editTask(index){
         console.log("Es wird Task mit Index bearbeutetr ",index);
         document.getElementById('card_overlay').innerHTML="";
         document.getElementById('card_overlay').innerHTML=editTaskTemplate(index);
 }