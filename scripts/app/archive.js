// archive section: archived offers and jobs tables, details, restore/delete buttons

document.querySelector("#archive").addEventListener("click", function () {
  document.querySelector("#bt-menu a.bt-menu-trigger").click(); //closemenu
  PrepareArchive();
});

function show_hide_date_filter(x){
  var filter=document.querySelector(".date_filter");
  var settingsButton=document.querySelector(".logo-container .settings");
  if(x==1){
    filter.classList.remove("hidden");
    settingsButton.classList.remove("hidden");
  }
  else if(x==0){
    filter.classList.add("hidden");
    settingsButton.classList.add("hidden");
  }
}

function PrepareArchive(){
  var element=document.querySelector(".date_filter #typeFilter");
  if(element){
    // do nothing
  }
  else{
    let  filter=`<div class="custom-select" id="typeFilter" >
    <select name="filter" style="margin:0">
      <option value="jobs" selected="selected">Εργασίες</option>
      <option value="offers">Προσφορές</option>
    </select>
    </div>`;
    document.querySelector(".date_filter").insertAdjacentHTML("afterbegin",filter)
  }
  show_hide_date_filter(1);
  var container = document.querySelector(".job-container");
  container.innerHTML = "";// remove cards if they exist

  document.querySelector("#PageTag").textContent = "ΑΡΧΕΙΟ";
}

function make_Offer_Archive_Table(offers) {
  
  var archive_table = document.querySelector(".job-container");
  archive_table.innerHTML = "";
  let anHTML = `<div class="tableContainer">
                <table id="Offer_Archive_Table"><tr><th>ΟΝΟΜΑ</th><th>ΗΜΕΡΟΜΗΝΙΑ</th><th>ΛΕΠΤΟΜΕΡΙΕΣ</th><th></th></tr>`;;


  for (let offer of offers) {
    let utcDate = new Date(offer.date).toUTCString();
    let formattedDate = new Date(utcDate).getDate() + "-" + (new Date(utcDate).getMonth() + 1) + "-" + new Date(utcDate).getFullYear();
    anHTML += `<tr>
       <td>${offer.offer_name}</td>
       <td>${formattedDate}</td>
       <td>
          <div class="details-btn">
            <button id="${offer.id}">&#x2022;   &#x2022;   &#x2022;</button>
          </div></td>
        <td>
          <div class="centered-container">
            <button class="delete-btn" id="${"delete-"+offer.id}">Διαγραφή</button>
            <button class="restore-btn" id="${"restore-"+offer.id}">Επαναφορά</button>
          </div>
        </td>
       </tr>`;
  }
  anHTML+="</table></div>";
  console.log(anHTML)
  archive_table.innerHTML=anHTML;

  make_offer_button_events();
}

function make_offer_button_events(){
  var btns = document.querySelectorAll(".details-btn button");
  var btn_id;
  btns.forEach((btn) => {
    btn.addEventListener("click", function (ev) {
      // ButtonID same as offer id
      if (ev.target.tagName === "BUTTON") {
        btn_id = ev.target.id;
      }
      //db query to get the offer
      getArchivedOfferDetails(btn_id)
    });
  });

  btns = document.querySelectorAll(".delete-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", function (ev) {
      // ButtonID same as offer id
      if (ev.target.tagName === "BUTTON") {
        let id=ev.target.id.split('-')[1];
        btn_id = id;
      }
      modal.innerHTML = `<div class="modal-content">
      <span class="close">&times;</span>
      <h3> ΕΠΙΒΕΒΑΙΩΣΗ ΔΙΑΓΡΑΦΗΣ</h3>
      <input name="delete-archived-offer" id="delete-archived-offer" type="button" value="ΔΙΑΓΡΑΦΗ">
    </div>`;
 
   modal.style.display = "block";
   var span = document.getElementsByClassName("close")[0];
   span.onclick = function () {
     modal.innerHTML = "";
     modal.style.display = "none";
   };
 
   document.querySelector("#delete-archived-offer").addEventListener("click", function () {
     //db query to deletr the offer
     modal.innerHTML = "";
     modal.style.display = "none";
     DeleteArchivedOffer(btn_id);
   });
      
    });
  });

  btns = document.querySelectorAll(".restore-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", function (ev) {
      // ButtonID same as offer id
      if (ev.target.tagName === "BUTTON") {
        let id=ev.target.id.split('-')[1];
        btn_id = id;
      }
      //db query to the offer
      RestoreArchivedOffer(btn_id);
    });
  });
}

function showArchivedOfferDetails(current_offer){
  //Show correct option in select menu
  let selectgamos = " ";
  let selectbaptisi = " ";
  let selectfoto = " ";
  if (current_offer.offer_type == "gamos") {
    selectgamos = `selected="selected"`;
  } else if (current_offer.offer_type == "baptisi") {
    selectbaptisi = `selected="selected"`;
  } else {
    selectfoto = `selected="selected"`;
  }

  modal.innerHTML = `<div class="modal-content">
     <span class="close">&times;</span>
     <p> ΠΡΟΣΦΟΡΑ:</p>
     <form class="offer_form">
       
       <label for="type">Τύπος</label>
       <select name="type">
         <option value="gamos" ${selectgamos}>Γάμος</option>
         <option value="baptisi" ${selectbaptisi}>Βάπτιση</option>
         <option value="fotografisi" ${selectfoto}>Φωτογράφιση</option>
       </select>
   
       <label for="job_name">Ονομα</label>
       <input type="text" id="job_name" name="job_name" placeholder="Το όνομα..." value="${current_offer.offer_name}" >

       <label for="fullname1">Ονοματεπώνυμο</label>
       <input type="text" id="fullname1" name="fullname1" placeholder="Το Ονοματεπώνυμο..." value="${current_offer.name1}" >

       <label for="fullname2">Ονοματεπώνυμο</label>
       <input type="text" id="fullname2" name="fullname2" placeholder="Το Ονοματεπώνυμο..." value="${current_offer.name2}" >
       
       <label for="phone">Τηλέφωνο</label>
       <input type="text" id="phone" name="phone" placeholder="Τηλέφωνο..." value="${current_offer.phone}">
  
       <label for="jobplace">Εκκλησία</label>
       <input type="text" id="place" name="jobplace" placeholder="Η εκκλησία..." value="${current_offer.church}">

       <label for="EventLocation">Δεξίωση</label>
       <input type="text" id="EventLocation" name="EventLocation" placeholder="Η ΔΕΞΙΩΣΗ..." value="${current_offer.EventLocation}">

       <label for="jobdate">Ημερομηνία</label>
       <input type="datetime-local" id="jobdate" name="jobdate" value="${current_offer.date.split('.')[0]}">
        
       <label for="package">Πακέτο Προσφοράς</label>
       <input name="show_package" id="show_package" type="button" value="Εμφάνιση">
       <input type="text" id="package" name="package" placeholder="Το πακέτο..." style="pointer-events: none;" value="${current_offer.offer_package}">

       <label for="price">Τιμή Προσφοράς</label>
       <input type="number" id="price" name="price" placeholder="Ποσό..." value="${current_offer.price}">

       <label for="description">Σχόλια</label>
       <textarea name="description" placeholder="Γράψε κάτι.." style="height:50px">${current_offer.description}</textarea>
       <input type="text" id="pdf_file_name" name="pdf_file_name" style="display: none;" value="${current_offer.pdf}">
       <input id="show_pdf" type="button" value="ΠΡΟΒΟΛΗ PDF">
       </form>
   </div>`;

  initDatePickers(modal);
  modal.style.display = "block";
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.innerHTML = "";
    modal.style.display = "none";
  };

  document.querySelector("#show_package").addEventListener("click", function () {
    let package_data=document.querySelector(".offer_form [name='package']").value;
    show_offer_package(package_data);
  });

  document.querySelector("#show_pdf").addEventListener("click", function () {
    
    show_pdf("archived_offer",current_offer.id,current_offer.pdf);
  });
}


function make_Job_Archive_Table(jobs) {
  
  var archive_table = document.querySelector(".job-container");
  archive_table.innerHTML = "";
  let anHTML = `<div class="tableContainer">
                <table id="Job_Archive_Table"><tr><th>ΟΝΟΜΑ</th><th>ΗΜΕΡΟΜΗΝΙΑ</th><th>ΛΕΠΤΟΜΕΡΙΕΣ</th><th></th></tr>`;;


  for (let job of jobs) {
    let utcDate = new Date(job.date).toUTCString();
    let formattedDate = new Date(utcDate).getDate() + "-" + (new Date(utcDate).getMonth() + 1) + "-" + new Date(utcDate).getFullYear();
    anHTML += `<tr>
       <td>${job.job_name}</td>
       <td>${formattedDate}</td>
       <td>
          <div class="details-btn">
            <button id="${job.id}">&#x2022;   &#x2022;   &#x2022;</button>
          </div></td>
        <td>
          <div class="centered-container">
            <button class="restore-btn" id="${"restore-"+job.id}">Επαναφορά</button>
            <button class="delete-btn" id="${"delete-"+job.id}">Διαγραφή</button>      
          </div>
        </td>
       </tr>`;
  }
  anHTML+="</table></div>";
  archive_table.innerHTML=anHTML;

  make_job_button_events();
}

function make_job_button_events(){
  var btns = document.querySelectorAll(".details-btn button");
  var btn_id;
  btns.forEach((btn) => {
    btn.addEventListener("click", function (ev) {
      // ButtonID same as offer id
      if (ev.target.tagName === "BUTTON") {
        btn_id = ev.target.id;
      }
      //db query to get the offer
      getArchivedJobDetails(btn_id)
    });
  });

  btns = document.querySelectorAll(".delete-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", function (ev) {
      // ButtonID same as offer id
      if (ev.target.tagName === "BUTTON") {
        let id=ev.target.id.split('-')[1];
        btn_id = id;
      }

      modal.innerHTML = `<div class="modal-content">
      <span class="close">&times;</span>
      <h3> ΕΠΙΒΕΒΑΙΩΣΗ ΔΙΑΓΡΑΦΗΣ</h3>
      <input name="delete-archived-job" id="delete-archived-job" type="button" value="ΔΙΑΓΡΑΦΗ">
    </div>`;
 
   modal.style.display = "block";
   var span = document.getElementsByClassName("close")[0];
   span.onclick = function () {
     modal.innerHTML = "";
     modal.style.display = "none";
   };
 
   document.querySelector("#delete-archived-job").addEventListener("click", function () {
     //db query to get the offer
     modal.innerHTML = "";
     modal.style.display = "none";
     DeleteArchivedJob(btn_id);
   });
       
    });
  });

  btns = document.querySelectorAll(".restore-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", function (ev) {
      // ButtonID same as offer id
      if (ev.target.tagName === "BUTTON") {
        let id=ev.target.id.split('-')[1];
        btn_id = id;
      }
      //db query to the offer
      RestoreArchivedJob(btn_id);

    });
  });
}

function showArchivedJobDetails(current_job){
  //make dates null values to empty strings to avoid errors
  if (current_job.sent_to_editor===null){current_job.sent_to_editor='';}
  if (current_job.recieved_from_editor===null){current_job.recieved_from_editor='';}
  if (current_job.sent_to_printer===null){current_job.sent_to_printer='';}
  if (current_job.recieved_from_printer===null){current_job.recieved_from_printer='';}
  if (current_job.initial_payment_date===null){current_job.initial_payment_date='';}
  if (current_job.final_payment_date===null){current_job.final_payment_date='';}

  console.log(current_job);
  //Show correct option in select menu
  let selectgamos = " ";
  let selectbaptisi = " ";
  let selectfoto = " ";
  if (current_job.job_type == "gamos") {
    selectgamos = `selected="selected"`;} 
  else if (current_job.job_type == "baptisi") {
    selectbaptisi = `selected="selected"`;} 
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

     <button class="collapsible">ΠΛΗΡΟΦΟΡΙΕΣ</button>
     <div class="content">
        <form class="offer_form">
       
          <label for="type">Τύπος</label>
          <select name="type">
            <option value="gamos" ${selectgamos}>Γάμος</option>
            <option value="baptisi" ${selectbaptisi}>Βάπτιση</option>
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
     <button class="collapsible">ΣΥΝΕΡΓΑΤΕΣ</button>
     <div class="content">
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
     
     <input id="show_pdf" type="button" value="ΠΡΟΒΟΛΗ PDF"></input>
     <input id="show_payments" type="button" value="Προβολή Πληρωμών">

    </div>
  
  </div>`;
  
   if(current_job.photographer1){document.querySelector(" ul li [name='ΦΩΤΟΓΡΑΦΟΣ1']").value=current_job.photographer1;};
  if(current_job.photographer2){document.querySelector(" ul li [name='ΦΩΤΟΓΡΑΦΟΣ2']").value=current_job.photographer2;};
  if(current_job.videographer1){document.querySelector(" ul li [name='ΒΙΝΤΕΟΓΡΑΦΟΣ1']").value=current_job.videographer1;};
  if(current_job.videographer2){document.querySelector(" ul li [name='ΒΙΝΤΕΟΓΡΑΦΟΣ2']").value=current_job.videographer2;  };
  if(current_job.printer){document.querySelector(" ul li [name='ΕΚΤΥΠΩΣΗ']").value=current_job.printer;};
  if(current_job.video_editor){document.querySelector(" ul li [name='ΜΟΝΤΑΖ']").value=current_job.video_editor;  };
  if(current_job.drone){document.querySelector(" ul li [name='Drone']").value=current_job.drone;};

  initDatePickers(modal);
  modal.style.display = "block";
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.innerHTML = "";
    modal.style.display = "none";
  };

  document.querySelector("#show_package").addEventListener("click", function () {
    let package_data=document.querySelector(".offer_form [name='package']").value;
    show_offer_package(package_data);
  });

  document.querySelector("#show_payments").addEventListener("click", function () {
    getPayments(current_job.id,"archive",current_job.price);
  });

  document.querySelector("#show_pdf").addEventListener("click", function () {
    
    show_pdf("archived_job",current_job.id,current_job.pdf);
  });

  //collapsible events
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }
}

