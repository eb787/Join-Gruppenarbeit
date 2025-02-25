
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