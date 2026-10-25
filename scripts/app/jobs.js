// job cards, job details modal, job form filling, task checklist, job status table

// create job cards
function make_job_cards(jobs) {
  document.querySelector("#PageTag").textContent = "ΑΡΧΙΚΗ";
  var jobs_to_add = document.querySelector(".job-container");
  jobs_to_add.innerHTML = "";
  let job_containerHTML = "";
  var image;
  for (let job of jobs) {
    if (job.job_type == "gamos") {
      image = "images/gamos.png";
    } else if (job.job_type == "baptisi") {
      image = "images/baptisi.png";
    } else if (job.job_type == "gamobaptisi") {
      image = "images/gamobaptisi.png";
    } else {
      image = "images/ergasia.png";
    }

    let utcDate = new Date(job.date).toUTCString();
    let formattedDate = new Date(utcDate).getDate() + "-" + (new Date(utcDate).getMonth() + 1) + "-" + new Date(utcDate).getFullYear();

    job_containerHTML += `<div class="job-wrapper">
                 <div class="job">
                     <div class="img">
                         <img
                             src=${image}>
                     </div>
                     <div class="info">
                         <div class="details">
                             <h1>${job.job_name}</h1>
                             <p>${formattedDate}</p>
                         </div>
                         <div  class="details-btn">
                             <button id="${job.id}">&#x2022;   &#x2022;   &#x2022;</button>
                         </div>
                     </div>
                 </div>
             </div>`;
  }

  jobs_to_add.innerHTML += job_containerHTML;
  details_job_modal();
}
//make_job_cards(Myjobs);

function check_id() {
  buttons = document.querySelectorAll(".job .details-btn");
  for (let button of buttons) {
    console.log(button.id);
  }
}

document.querySelector("#jobs").addEventListener("click", function () {
  document.querySelector("#bt-menu a.bt-menu-trigger").click(); //closemenu
  var element=document.querySelector(".date_filter #typeFilter");
  if(element){
    element.remove();
  }  
  show_hide_date_filter(1);
  getJobStatus();

});

document.querySelector("#offers").addEventListener("click", function () {
  document.querySelector("#bt-menu a.bt-menu-trigger").click(); //closemenu
  var element=document.querySelector(".date_filter #typeFilter");
  if(element){
    element.remove();
  }
  show_hide_date_filter(1);
  getOfferCards();
});


// Get the modal
const modal = document.getElementById("myModal");
var btn_id = 0;
// Get the button that opens the modal
function details_job_modal() {
  const btns = document.querySelectorAll(".details-btn button");

  btns.forEach((btn) => {
    btn.addEventListener("click", function (ev) {
      // ButtonID same as job id
      if (ev.target.tagName === "BUTTON") {
        btn_id = ev.target.id;
      }
      //db query to get the job
      console.log(btn_id);
      getJobDetails(btn_id);
    });
  });
}

function showJobDetails(current_job){

  //make dates null values to empty strings to avoid errors
  if (current_job.sent_to_editor===null){current_job.sent_to_editor='';}
  if (current_job.recieved_from_editor===null){current_job.recieved_from_editor='';}
  if (current_job.sent_to_printer==null){current_job.sent_to_printer='';}
  if (current_job.recieved_from_printer===null){current_job.recieved_from_printer='';}
  if (current_job.initial_payment_date===null){current_job.initial_payment_date='';}
  if (current_job.final_payment_date===null){current_job.final_payment_date='';}


  //Show correct option in select menu
  let selectgamos = " ";
  let selectbaptisi = " ";
  let selectgamobaptisi = " ";
  let selectfoto = " ";
  if (current_job.job_type == "gamos") {
    selectgamos = `selected="selected"`;} 
  else if (current_job.job_type == "baptisi") {
    selectbaptisi = `selected="selected"`;} 
  else if (current_job.job_type == "gamobaptisi") {
    selectgamobaptisi = `selected="selected"`;} 
  else {
    selectfoto = `selected="selected"`;}

  Associates=MyAssociates.filter(function(person){return person.associate_type!="Άλμπουμ"});
  AlbumPrinterAssociates=MyAssociates.filter(function(person){return person.associate_type=="Άλμπουμ"});
  
  var associateSelection="";
  var AlbumPrinterSelection=""; 

 for(associate of Associates){
  associateSelection+=`<option value=${associate.id}>${associate.firstname} ${associate.surname}</option>`;
 }
 for(printer of AlbumPrinterAssociates){
  AlbumPrinterSelection+=`<option value=${printer.id}>${printer.firstname} ${printer.surname}</option>`;
 }


  modal.innerHTML = `<div class="modal-content">
     <span class="close">&times;</span>
     <h3>Λεπτομέριες Εργασίας</h3>

     <div class="tab-bar" role="tablist">
       <button type="button" class="tab-btn" role="tab" data-tab="info">ΠΛΗΡΟΦΟΡΙΕΣ</button>
       <button type="button" class="tab-btn" role="tab" data-tab="tasks">ΕΡΓΑΣΙΕΣ <span class="tab-count"></span></button>
       <button type="button" class="tab-btn" role="tab" data-tab="crew">ΣΥΝΕΡΓΑΤΕΣ</button>
       <button type="button" class="tab-btn" role="tab" data-tab="payments">ΠΛΗΡΩΜΕΣ</button>
       <button type="button" class="tab-btn" role="tab" data-tab="pdf">PDF</button>
     </div>
     <div class="tab-panel" role="tabpanel" data-tab="info">
        <form class="offer_form">
       
          <label for="type">Τύπος</label>
          <select name="type">
            <option value="gamos" ${selectgamos}>Γάμος</option>
            <option value="baptisi" ${selectbaptisi}>Βάπτιση</option>
            <option value="gamobaptisi" ${selectgamobaptisi}>Γαμοβάπτιση</option>
            <option value="fotografisi" ${selectfoto}>Φωτογράφιση</option>
          </select>
      
          <label for="job_name">Ονομα</label>
          <input type="text" id="job_name" name="job_name" placeholder="Το όνομα..." value="${current_job.job_name}" >

          <label for="fullname1">Ονοματεπώνυμο</label>
          <input type="text" id="fullname1" name="fullname1" placeholder="Το Ονοματεπώνυμο..." value="${current_job.name1}" >

          <label for="fullname2">Ονοματεπώνυμο</label>
          <input type="text" id="fullname2" name="fullname2" placeholder="Το Ονοματεπώνυμο..." value="${current_job.name2}" >
          
          <label for="phone">Τηλέφωνο</label>
          <input type="text" id="phone" name="phone" placeholder="Τηλέφωνο..." value="${current_job.phone}">
  
          <label for="jobplace">Εκκλησία</label>
          <input type="text" id="place" name="jobplace" placeholder="Η εκκλησία..." value="${current_job.church}">
          
          <label for="EventLocation">Δεξίωση</label>
          <input type="text" id="EventLocation" name="EventLocation" placeholder="Η ΔΕΞΙΩΣΗ..." value="${current_job.EventLocation}">

          <label for="jobdate">Ημερομηνία</label>
          <input type="datetime-local" id="jobdate" name="jobdate" value="${current_job.date.split('.')[0]}">
          
          <label for="groom_place" style="display:block;">Προετοιμασία Γαμπρού</label>
          <span style="display:block;">
          <input type="text" id="groom_place" name="groom_place" value="${current_job.groom_place}" style="width:min-content">
          <input type="time" id="groom_time" name="groom_time" value="${current_job.groom_time}" style="width:min-content">
          </span>

          <label for="bride_place" style="display:block;">Προετοιμασία Νύφης</label>
          <span style="display:block;">
          <input type="text" id="bride_place" name="bride_place" value="${current_job.bride_place}" style="width:min-content">
          <input type="time" id="bride_time" name="bride_time" value="${current_job.bride_time}" style="width:min-content">
          </span>

          <label for="package">Πακέτο Προσφοράς</label>
          <input name="show_package" id="show_package" type="button" value="Εμφάνιση">
          <input type="text" id="package" name="package" placeholder="Το πακέτο..." style="pointer-events: none;" value="${current_job.offer_package}">

          <label for="price">Τιμή Προσφοράς</label>
          <input type="number" id="price" name="price" placeholder="Ποσό..." value="${current_job.price}">

          <label for="description">Σχόλια</label>
          <textarea name="description" placeholder="Γράψε κάτι.." style="height:50px">${current_job.description}</textarea>
          <input type="text" id="pdf_file_name" name="pdf_file_name" style="display: none;" value="${current_job.pdf}">
          
        </form>
     </div>
     <div class="tab-panel" role="tabpanel" data-tab="tasks">
         <ul class="to-do-list" id="myUL">
             <li id="task1">ΠΑΡΑΔΟΣΗ ΦΩΤΟΓΡΑΦΙΩΝ</li>
             <li id="task2">ΠΑΡΑΔΟΣΗ ΒΙΝΤΕΟ</li>
             <li id="task3">
                ΜΟΝΤΑΖ
               <input type="date" id="EditSentDate" name="EditSentDate" value="${current_job.sent_to_editor.split("T")[0]}">
               <input type="date" id="EditRecievedDate" name="EditRecievedDate" value="${current_job.recieved_from_editor.split("T")[0]}" >
             </li> 
             <li id="task4">ΔΕΙΓΜΑΤΑ</li>
             <li id="task5">ΑΠΟΣΤΟΛΗ ΔΕΙΓΜΑΤΩΝ</li>
             <li id="task6">ΑΛΜΠΟΥΜ</li>
             <li id="task7">ΑΠΟΣΤΟΛΗ ΑΛΜΠΟΥΜ</li> 
             <li id="task8">ΑΛΛΑΓΕΣ ΑΛΜΠΟΥΜ</li>
             <li id="task9">ΤΕΛΙΚΟΣ ΕΛΕΓΧΟΣ</li>
             <li id="task10">ΕΚΤΥΠΩΣΗ ΑΛΜΠΟΥΜ
               <input type="date" id="PrintSentDate" name="PrintSentDate" value="${current_job.sent_to_printer.split("T")[0]}" >
               <input type="date" id="PrintRecievedDate" name="PrintRecievedDate" value="${current_job.recieved_from_printer.split("T")[0]}">
             </li>
             <li id="task11">ΠΑΡΑΔΟΣΗ ΣΤΟΝ ΠΕΛΑΤΗ</li>
         </ul>
     </div>
     <div class="tab-panel" role="tabpanel" data-tab="crew">
     <ul class="job-associates" style="list-style-type: none;">
         <li>
             <div class="selection-container">
                 <div class="selectorlabel">ΦΩΤΟΓΡΑΦΟΣ 1</div>
                 <div class="custom-select">
                     <select name="ΦΩΤΟΓΡΑΦΟΣ1">
                     <option value="" selected="selected"> ΕΠΙΛΟΓΗ</option>
                     ${associateSelection}
                     </select>
                 </div>
                 <input type="number" id="ph1_pay" name="ph1_pay" placeholder="Μεροκάματο..." value="${current_job.ph1_payment}" >
                 <input type="checkbox" id="ph1_pay_done" name="ph1_pay_done" ${checkbox_status(current_job.ph1_pay_done)} >
              </div>  
         </li>
         <li>
             <div class="selection-container">
                 <div class="selectorlabel">ΦΩΤΟΓΡΑΦΟΣ 2</div>
                 <div class="custom-select" >
                     <select name="ΦΩΤΟΓΡΑΦΟΣ2">
                     <option value="" selected="selected">ΕΠΙΛΟΓΗ</option>
                     ${associateSelection}
                     </select>
                 </div>
                 <input type="number" id="ph2_pay" name="ph2_pay" placeholder="Μεροκάματο..." value="${current_job.ph2_payment}">
                 <input type="checkbox" id="ph2_pay_done" name="ph2_pay_done" ${checkbox_status(current_job.ph2_pay_done)} >
             </div>
         </li>
         <li>
             <div class="selection-container">
                 <div class="selectorlabel">ΒΙΝΤΕΟΓΡΑΦΟΣ 1</div>
                 <div class="custom-select" >
                     <select name="ΒΙΝΤΕΟΓΡΑΦΟΣ1">
                     <option value="" selected="selected" >ΕΠΙΛΟΓΗ</option>
                     ${associateSelection}
                     </select>
                 </div>
                 <input type="number" id="vd1_pay" name="vd1_pay" placeholder="Μεροκάματο..." value="${current_job.vid1_payment}">
                 <input type="checkbox" id="vd1_pay_done" name="vd1_pay_done" ${checkbox_status(current_job.vid1_pay_done)} >
             </div>
         </li>
         <li>
             <div class="selection-container">
                 <div class="selectorlabel">ΒΙΝΤΕΟΓΡΑΦΟΣ 2</div>
                 <div class="custom-select" >
                     <select name="ΒΙΝΤΕΟΓΡΑΦΟΣ2">
                     <option value="" selected="selected">ΕΠΙΛΟΓΗ</option>
                      ${associateSelection}
                     </select>
                 </div>
                 <input type="number" id="vd2_pay" name="vd2_pay" placeholder="Μεροκάματο..." value="${current_job.vid2_payment}">
                 <input type="checkbox" id="vd2_pay_done" name="vd2_pay_done" ${checkbox_status(current_job.vid2_pay_done)} >
             </div> 
         </li>
         <li>
            <div class="selection-container">
                <div class="selectorlabel">ΧΕΙΡΙΣΤΗΣ DRONE</div>
                <div class="custom-select" >
                    <select name="Drone">
                    <option value="" selected="selected">ΕΠΙΛΟΓΗ</option>
                    ${associateSelection}
                    </select>
                </div>
                <input type="number" id="drone_pay" name="drone_pay" placeholder="Μεροκάματο..." value="${current_job.drone_payment}">
                <input type="checkbox" id="drone_pay_done" name="drone_pay_done" ${checkbox_status(current_job.drone_pay_done)} >
            </div>  
          </li>
          <li>
            <div class="selection-container">
                <div class="selectorlabel">ΜΟΝΤΑΖ</div>
                <div class="custom-select" >
                    <select name="ΜΟΝΤΑΖ">
                    <option value="" selected="selected">ΕΠΙΛΟΓΗ</option>
                    ${associateSelection}
                    </select>
                </div>
                <input type="number" id="editor_pay" name="editor_pay" placeholder="Μεροκάματο..." value="${current_job.editor_payment}">
                <input type="checkbox" id="editor_pay_done" name="editor_pay_done" ${checkbox_status(current_job.editor_pay_done)} >
            </div> 
          </li>
         <li>
            <div class="selection-container">
                <div class="selectorlabel">ΕΚΤΥΠΩΣΗ ΑΛΜΠΟΥΜ</div>
                <div class="custom-select" >
                    <select name="ΕΚΤΥΠΩΣΗ">
                    <option value="" selected="selected">ΕΠΙΛΟΓΗ</option>
                    ${AlbumPrinterSelection}
                    </select>
                </div>
                <input type="number" id="printer_pay" name="printer_pay" placeholder="Μεροκάματο..." value="${current_job.printer_payment}">
                <input type="checkbox" id="printer_pay_done" name="printer_pay_done" ${checkbox_status(current_job.printer_pay_done)} >
            </div> 
          </li>
     </ul>  
    </div>
     <div class="tab-panel payments-panel" role="tabpanel" data-tab="payments"></div>
     <div class="tab-panel pdf-panel" role="tabpanel" data-tab="pdf"></div>
     
     <div class="modal-actions">
       <input id="update_job" type="button" value="Αποθήκευση">
       <input id="add_to_Calendar" class="push-right" type="button" value="Προσθήκη στο Ημερολόγιο" style="background-color:#213A5C">
       <input id="archive_job" class="danger-btn" type="button" value="Αρχειοθέτηση">
     </div>

    </div>
  
  </div>`;
  fill_form(current_job);
  make_checklist_events();
  update_task_count();
  initTabs(modal);
  initDatePickers(modal);
  getPayments(current_job.id,"",current_job.price);
  modal.style.display = "block";

  document.querySelector("#update_job").addEventListener("click", function () {
    updateJob(current_job.id)
  });
  document.querySelector("#show_package").addEventListener("click", function () {
    let package_data=document.querySelector(".offer_form [name='package']").value;
    show_offer_package(package_data);
  });
  document.querySelector("#archive_job").addEventListener("click", function () {
    archiveJob(current_job.id)
  });
  document.querySelector("#add_to_Calendar").addEventListener("click", function () {
    addCalendarEvent();
  });
  // pdf tab is filled on first open so the preview isn't downloaded for every job
  modal.querySelector(".tab-btn[data-tab='pdf']").addEventListener("click", function () {
    show_pdf("job",current_job.id,current_job.pdf,modal.querySelector(".pdf-panel"));
  }, { once: true });
}

function fill_form(current_job) {
  var list_items = document.querySelectorAll(".to-do-list li");
  //Show correct option in select menu

  if (current_job.task1) {
    list_items[0].classList.add("selected");
    list_items[0].classList.add("checked");
  }

  if (current_job.task2) {
    list_items[1].classList.add("selected");
    list_items[1].classList.add("checked");
  }
  if (current_job.task3) {
    list_items[2].classList.add("selected");
    list_items[2].classList.add("checked");
  }
  if (current_job.task4) {
    list_items[3].classList.add("selected");
    list_items[3].classList.add("checked");
  }
  if (current_job.task5) {
    list_items[4].classList.add("selected");
    list_items[4].classList.add("checked");
  }
  if (current_job.task6) {
    list_items[5].classList.add("selected");
    list_items[5].classList.add("checked");
  }
  if (current_job.task7) {
    list_items[6].classList.add("selected");
    list_items[6].classList.add("checked");
  }
  if (current_job.task8) {
    list_items[7].classList.add("selected");
    list_items[7].classList.add("checked");
  }
  if (current_job.task9) {
    list_items[8].classList.add("selected");
    list_items[8].classList.add("checked");
  }
  if (current_job.task10) {
    list_items[9].classList.add("selected");
    list_items[9].classList.add("checked");
  }
  if (current_job.task11) {
    list_items[10].classList.add("selected");
    list_items[10].classList.add("checked");
  }

  // fill associates
  if(current_job.photographer1){document.querySelector(" ul li [name='ΦΩΤΟΓΡΑΦΟΣ1']").value=current_job.photographer1;};
  if(current_job.photographer2){document.querySelector(" ul li [name='ΦΩΤΟΓΡΑΦΟΣ2']").value=current_job.photographer2;};
  if(current_job.videographer1){document.querySelector(" ul li [name='ΒΙΝΤΕΟΓΡΑΦΟΣ1']").value=current_job.videographer1;};
  if(current_job.videographer2){document.querySelector(" ul li [name='ΒΙΝΤΕΟΓΡΑΦΟΣ2']").value=current_job.videographer2;  };
  if(current_job.printer){document.querySelector(" ul li [name='ΕΚΤΥΠΩΣΗ']").value=current_job.printer;};
  if(current_job.video_editor){document.querySelector(" ul li [name='ΜΟΝΤΑΖ']").value=current_job.video_editor;  };
  if(current_job.drone){document.querySelector(" ul li [name='Drone']").value=current_job.drone;};
}

function checkbox_status(checked){
  if(checked){
    return "checked"
  }
  else{
    return "unchecked"
  }
}

// done/total count shown on the ΕΡΓΑΣΙΕΣ tab
function update_task_count() {
  var items = document.querySelectorAll(".modal .to-do-list li");
  var done = document.querySelectorAll(".modal .to-do-list li.checked").length;
  document.querySelector(".modal .tab-count").textContent = `${done}/${items.length}`;
}

function make_checklist_events() {
  // Add a "checked" symbol when clicking on a list item
  var list = document.querySelector(".modal ul");
  list.addEventListener(
    "click",
    function (ev) {
      if (ev.target.tagName === "LI") {
        ev.target.classList.toggle("checked");
        update_task_count();
      }
    },
    false
  );
  // When the user clicks on <span> (x), close the modal
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.innerHTML = "";
    modal.style.display = "none";
  };
}

/* When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.innerHTML = "";
    modal.style.display = "none";
  }
};*/

function make_job_status_table(jobs){
  
  document.querySelector("#PageTag").textContent = "ΕΡΓΑΣΙΕΣ";
  var job_status_table = document.querySelector(".job-container");
  job_status_table.innerHTML = "";
  let anHTML = `<div class="status_table_print_button_container">
                  <button id="status_table_print">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                    </svg>
                  </button>
                </div>
                <div class="tableContainer">
                <table id="Job_Status_Table"><tr><th>ΕΙΔΟΣ</th><th>ΟΝΟΜΑ</th><th>ΗΜΕΡΟΜΗΝΙΑ</th><th>ΚΑΤΑΣΤΑΣΗ</th><th>ΛΕΠΤΟΜΕΡΙΕΣ</th></tr>`;;

  var status_task;
  for (let job of jobs) {
    if( job.task11==1){ status_task="ΠΑΡΑΔΟΣΗ ΣΤΟΝ ΠΕΛΑΤΗ"}
    else if(job.task10==1){ status_task="ΕΚΤΥΠΩΣΗ ΑΛΜΠΟΥΜ"}
    else if(job.task9==1){ status_task="ΤΕΛΙΚΟΣ ΕΛΕΓΧΟΣ"}
    else if(job.task8==1){ status_task="ΑΛΛΑΓΕΣ ΑΛΜΠΟΥΜ"}
    else if(job.task7==1){ status_task="ΑΠΟΣΤΟΛΗ ΑΛΜΠΟΥΜ"}
    else if(job.task6==1){ status_task="ΑΛΜΠΟΥΜ"}
    else if(job.task5==1){ status_task="ΑΠΟΣΤΟΛΗ ΔΕΙΓΜΑΤΩΝ"}
    else if(job.task4==1){ status_task="ΔΕΙΓΜΑΤΑ"}
    else if(job.task3==1){ status_task="ΜΟΝΤΑΖ"}
    else if(job.task2==1){ status_task="ΠΑΡΑΔΟΣΗ ΒΙΝΤΕΟ"}
    else if(job.task1==1){ status_task="ΠΑΡΑΔΟΣΗ ΦΩΤΟΓΡΑΦΙΩΝ"}
    else{status_task="ΔΕΝ ΕΧΕΙ ΕΚΤΕΛΕΣΤΕΙ"}


    let utcDate = new Date(job.date).toUTCString();
    let formattedDate = new Date(utcDate).getDate() + "-" + (new Date(utcDate).getMonth() + 1) + "-" + new Date(utcDate).getFullYear();
    let type=""
    if(job.job_type==="gamos"){
      type="ΓΑΜΟΣ";
    }
    else if(job.job_type==="fotografisi"){
      type="ΦΩΤΟΓΡΑΦΙΣΗ";
    }
    else if(job.job_type==="baptisi"){
      type="ΒΑΠΤΙΣΗ";
    }
    else if(job.job_type==="gamobaptisi"){
      type="ΓΑΜΟΒΑΠΤΙΣΗ";
    }
    anHTML += `<tr>
       <td>${type}</td>
       <td>${job.job_name}</td>
       <td>${formattedDate}</td>
       <td>
          ${status_task}
       </td>
       <td>
          <div class="details-btn">
            <button id="${job.id}">&#x2022;   &#x2022;   &#x2022;</button>
          </div></td>
        
       </tr>`;
  }
  anHTML+="</table></div>";
  job_status_table.innerHTML=anHTML;
  
  document.querySelector("#status_table_print").addEventListener('click',function (){
    var table= document.querySelector("#Job_Status_Table");
    var today=new Date().toUTCString();
    var formated_date=new Date(today).getDate().toString()+'_'+(new Date(today).getMonth()+1).toString()+'_'+new Date(today).getFullYear().toString();
    var opt = {
      pagebreak: { mode: ['css'] },
      margin:       1,
      filename:     'Katastasi_'+formated_date+'.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'cm', format: 'a4', orientation: 'l' }
    };
    
    html2pdf().set(opt).from(table).save();
})

  var btns = document.querySelectorAll(".details-btn button");
  var btn_id;
  btns.forEach((btn) => {
    btn.addEventListener("click", function (ev) {
      // ButtonID same as offer id
      if (ev.target.tagName === "BUTTON") {
        btn_id = ev.target.id;
      }
      //db query to get the offer
      getJobDetails(btn_id)
    });
  });
} 

