
function subTaskListRender(){
console.log("Render Sub TaskList");
element= document.getElementById('subTaskList');
element.innerHTML="";
element.innerHTML += taskSubTaskList.map((designation, index)=>
    SubtaskListTemplate(designation,index)
).join("");
}


function taskRenderContactList(index,name,color,email){
  let element= document.getElementById('taskDropDownList');
  element.innerHTML += taskContacListTemplate(index,name,contactColorAssign(color),taskInitialLettersCreate(name),email);
}

function taskContacInitialRender(selectContact){
  let element= document.getElementById('initialeIconList');
  selectContact.map(empty=>{
    let name=empty.name;
    let color = empty.color;
    element.innerHTML += taskContacInitialTemplate(contactColorAssign(color),taskInitialLettersCreate(name));
  });
}


function contactColorAssign(color){
   return contactColorArray[color-1];
}


function taskInitialLettersCreate(name){
let initials = name.split(" ").map(word => word[0]).join("");
return initials;

}


