
function subTaskListRender(){
console.log("Render Sub TaskList");
element= document.getElementById('subTaskList');
element.innerHTML="";
element.innerHTML += taskSubTaskList.map((designation, index)=>
    SubtaskListTemplate(designation,index)
).join("");
}


function taskRenderContactList(name,color){
   let element= document.getElementById('taskDropDownList');
  element.innerHTML += taskContacListTemplate(name,contactColorAssign(color),taskInitialLettersCreate(name));
}


function contactColorAssign(color){
   return contactColorArray[color-1];
}


function taskInitialLettersCreate(name){
let initials = name.split(" ").map(word => word[0]).join("");
return initials;

}


