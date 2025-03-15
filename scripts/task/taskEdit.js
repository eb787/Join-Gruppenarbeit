
 //Ab hier Task Edit
console.log("taskEdit.js");

 function editTask(index){
         console.log("Es wird Task mit Index bearbeutetr ",index);
         document.getElementById('card_overlay').innerHTML="";
         document.getElementById('card_overlay').innerHTML=editTaskTemplate(index);
         console.log("prio = ",currentTasks[index].prio);      
         checkPrioEditTask(index);   
         
         test(index);
        
 }



 function checkPrioEditTask(index){
 let prio =currentTasks[index].prio;
 switch (prio){
        case"high_prio":
        btnPrioSelect('urgent')
        break;
        case"medium_prio":
        btnPrioSelect('medium')
        break;
        case"low_prio":
        btnPrioSelect('low')
        break;              
 }
  }



  function test(index){
        console.log(currentTasks[index]);
       console.log(currentTasks[index].contacts);
  }
  
  





  function taskReadinArrayContact(DataContact) {
        let= index=0;
        document.getElementById('taskDropDownList').innerHTML="";
        taskContacteArray = Object.values(DataContact)
        .flatMap(array=>array.map(entry=>({
          name:entry.name,
          email:entry.email,
          color: entry.color || "10"
        })));
        console.log("Array mit name,Maikl ",taskContacteArray);
      
        taskContacteArray.map((contact,index) =>{
            taskRenderContactList(index,contact.name,contact.color ||  "10",contact.email);
            });
         }



  function taskRenderContactList(index,name,color,email){
        let element= document.getElementById('taskDropDownList');
        element.innerHTML += taskContacListTemplate(index,name,contactColorAssign(color),taskInitialLettersCreate(name),email);
      }