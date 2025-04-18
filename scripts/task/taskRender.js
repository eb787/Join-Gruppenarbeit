/**
 * Function to render the designation
 */
function subTaskListRender(){
element= document.getElementById('subTaskList');
element.innerHTML="";
element.innerHTML += taskSubTaskList.map((designation, index)=>
    SubtaskListTemplate(designation,index)
).join("");
}


/**
 * Function to render the contacts if any exist
 * @param {number} index Index of contacts
 * @param {String} name  Name of the contact
 * @param {number} color Color of the contact
 * @param {String} email email of the contact
 */
function taskRenderContactList(index,name,color,email,check){
  let element= document.getElementById('taskDropDownList');
  element.innerHTML += taskContacListTemplate(index,name,contactColorAssign(color),taskInitialLettersCreate(name),email,check);
}


/**
 * Function to render the initials from a contact
 * @param {Array} selectContact  contact array
 */
function taskContacInitialRender(selectContact){
  let element= document.getElementById('initialeIconList');
  let entriesLenght = selectContact.length;
  if(entriesLenght <=5){
      selectContact.map(empty=>{
      let name=empty.name;
      let color = empty.color;
      element.innerHTML += taskContacInitialTemplate(contactColorAssign(color),taskInitialLettersCreate(name),"");
    });
  }else{
    for(l=0;l<5;l++){
      let name=selectContact[l].name;
      let color = selectContact[l].color;
      element.innerHTML += taskContacInitialTemplate(contactColorAssign(color),taskInitialLettersCreate(name));   
     };
      element.innerHTML+= "+ " + (entriesLenght-4);
  }
}


/**
 * function searches the matching color from the array to the corresponding number
 * @param {numberumber} color Color number from the DB 
 * @returns 
 */
function contactColorAssign(color){
   return contactColorArray[color-1];
}


/**
 * Function that always takes the first letter of the first name and last name
 * @param {String} name Name from the DB
 * @returns 
 */
function taskInitialLettersCreate(name){
let initials = name.split(" ").map(name => name[0]).join("");
return initials;
}


