
function taskRenderContact(){
console.log("Rende List");
    const testList =[
        {value:'1', text:'Eintrag1'},
        {value:'2', text:'Eintrag2'},
        {value:'3', text:'Eintrag3'},
    ];

    let contaklist='';
    testList.forEach(option =>{
        contaklist += ` <option value="${option.value}">${option.text}</option>`
    });

    document.getElementById('taskContaktList').innerHTML=contaklist;
}



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


