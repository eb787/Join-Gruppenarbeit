
 //Ab hier Task Edit

 function editTask(index){

 console.log("Es wird Task mit Index bearbeutetr ",index);

 document.getElementById('card_overlay').innerHTML="";
 
 document.getElementById('card_overlay').innerHTML=editTaskTemplate(index);
 

}