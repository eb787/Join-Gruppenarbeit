
//Ab hier Task Edit
console.log("taskEdit.js");

function editTask(index) {
        console.log("Es wird Task mit Index bearbeutetr ", index);
        document.getElementById('card_overlay').innerHTML = "";
        document.getElementById('card_overlay').innerHTML = editTaskTemplate(index);
        console.log("prio = ", currentTasks[index].prio);
        checkPrioEditTask(index);
        editTaskWriteContacts(currentTasks[index].contacts);
}


function checkPrioEditTask(index) {
        let prio = currentTasks[index].prio;
        switch (prio) {
                case "high_prio":
                        btnPrioSelect('urgent')
                        break;
                case "medium_prio":
                        btnPrioSelect('medium')
                        break;
                case "low_prio":
                        btnPrioSelect('low')
                        break;
        }
}


function editTaskWriteContacts(contactList) {
        let element = document.getElementById('initialeIconList');
        contactList.map(emtry => {
                let name = emtry.name ;
                let color = emtry.color ;
                element.innerHTML += taskContacInitialTemplate(contactColorAssign(color),taskInitialLettersCreate(name));
        });
}

function taskContactListDrobdown1() {
        console.log("Öffne Liste");
        loadContacsFirebase();
        document.getElementById('taskContactDrowdownMenue').classList.toggle('ele_show');
        document.getElementById('initialeIconList').classList.toggle('icon_List_hide')
      }

      async function loadContacsFirebase(){
        try{
           let dataCont = await fetch(Base_URL + "/contacts/" + ".json")
           dataRaskEditContact = await dataCont.json();
           console.log("Contace ",dataRaskEditContact);
       }catch{
           console.log("Fehler beim Laden")
        }
        taskReadinArrayContact(dataRaskEditContact);
   }

   function taskContactFilterList1() {
        let input = document.getElementById("taskDropDownInput").value.toLowerCase();
        let entries = document.querySelectorAll(".contact_Label_Item");
        entries.forEach(entries => {
          let labelText = entries.textContent.toLowerCase();
          if (labelText.includes(input)) {
            entries.style.display = "flex";
          } else {
            entries.style.display = "none";
          }
        });
      }


