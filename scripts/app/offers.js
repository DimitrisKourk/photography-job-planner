// offer cards, offer details, new offer form, offer print preview / pdf

//make pending offer cards

function make_offer_cards(offers) {
  document.querySelector("#PageTag").textContent = "ΠΡΟΣΦΟΡΕΣ";
  var offers_to_add = document.querySelector(".job-container");
  offers_to_add.innerHTML = "";
  let offers_containerHTML = "";
  var image;
  console.log(offers);
  for (let offer of offers) {
    image = "images/prosfora.png";
    
    let utcDate = new Date(offer.date).toUTCString();
    let formattedDate = new Date(utcDate).getDate() + "-" + (new Date(utcDate).getMonth() + 1) + "-" + new Date(utcDate).getFullYear();

    offers_containerHTML += `<div class="job-wrapper">
                 <div class="job">
                     <div class="img">
                         <img
                             src=${image}>
                     </div>
                     <div class="info">
                         <div class="details">
                             <h1>${offer.offer_name}</h1>
                             <p>${formattedDate}</p>
                         </div>
                         <div  class="details-btn">
                             <button id="${offer.id}">&#x2022;   &#x2022;   &#x2022;</button>
                         </div>
                     </div>
                 </div>
             </div>`;
  }

  offers_to_add.innerHTML += offers_containerHTML;
  details_offer_modal();
}


function details_offer_modal() {
  const btns = document.querySelectorAll(".details-btn button");

  btns.forEach((btn) => {
    btn.addEventListener("click", function (ev) {
      // ButtonID same as job id
      if (ev.target.tagName === "BUTTON") {
        btn_id = ev.target.id;
      }
      //db query to get the job
      getOfferDetails(btn_id);
      
    });
  });
}

function showOfferDetails(current_offer){
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
       
       <input id="update_offer" type="button" value="Αποθήκευση">
       <input id="make_job" type="button" value="Εκλεισε">
       
       <input id="archive_offer" type="button" value="Αρχειοθέτηση">

     </form>
   </div>`;

   
  initDatePickers(modal);
  modal.style.display = "block";
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.innerHTML = "";
    modal.style.display = "none";
  };

  document.querySelector("#make_job").addEventListener("click", function () {
      addJob(current_offer.id);
    });
  document.querySelector("#update_offer").addEventListener("click", function () {
      updateOffer(current_offer.id);
    });
    
  document.querySelector("#show_package").addEventListener("click", function () {
    let package_data=document.querySelector(".offer_form [name='package']").value;
    show_offer_package(package_data);
  });

  document.querySelector("#show_pdf").addEventListener("click", function () {
    
    show_pdf("offer",current_offer.id,current_offer.pdf);
  });

  
  document.querySelector("#archive_offer").addEventListener("click", function () {
    archiveOffer(current_offer.id);
  });
}

document.querySelector(".float").addEventListener("click", function () {
  create_offer();
});
function create_offer() {
  var today=new Date();
  totay=today.setHours(today.getHours()+2);
  today=today.toISOString().split('.')[0];
  modal.innerHTML = `<div class="modal-content">
         <span class="close">&times;</span>
         <p> NEA ΠΡΟΣΦΟΡΑ:</p>
         <form class="offer_form">
     
           <label for="type">Τύπος</label>
           <select id="type" name="type">
             <option value="gamos" >Γάμος</option>
             <option value="baptisi">Βάπτιση</option>
             <option value="fotografisi" selected="selected">Φωτογράφιση</option>
           </select>
 
           <label for="job_name">Ονομα</label>
           <input type="text" id="job_name" name="job_name" placeholder="Το όνομα...">

           <label for="fullname1">Ονοματεπώνυμο</label>
           <input type="text" id="fullname1" name="fullname1" placeholder="Το Ονοματεπώνυμο..." >

           <label for="fullname2">Ονοματεπώνυμο</label>
           <input type="text" id="fullname2" name="fullname2" placeholder="Το Ονοματεπώνυμο..." >
           
           <label for="phone">Τηλέφωνο</label>
           <input type="text" id="phone" name="phone" placeholder="Τηλέφωνο...">
  
           <label for="jobplace">Εκκλησία</label>
           <input type="text" id="place" name="jobplace" placeholder="Η εκκλησία..." >

           <label for="EventLocation">Δεξίωση</label>
           <input type="text" id="EventLocation" name="EventLocation" placeholder="Η ΔΕΞΙΩΣΗ...">

           <label for="jobdate">Ημερομηνία</label>
           <input type="datetime-local" id="date" name="jobdate" value=${today}>
           
           <label for="package">Πακέτο Προσφοράς</label>
           <input name="show_package" id="show_package" type="button" value="Εμφάνιση">
           <input type="text" id="package" name="package" placeholder="Το πακέτο..." style="pointer-events: none;">

           <label for="price">Τιμή Προσφοράς</label>
           <input type="number" id="price" name="price" placeholder="Ποσό..." value=0 >

           <label for="info">Σχόλια</label>
           <textarea name="description" placeholder="Γράψε κάτι.." style="height:50px"></textarea>
            <input type="text" id="pdf_file_name" name="pdf_file_name" style="display: none;" value="">
           <input id="new_offer" type="button" value="ΔΗΜΙΟΥΡΓΙΑ ΠΡΟΣΦΟΡΑΣ">
           <input id="new_job" type="button" value="ΔΗΜΙΟΥΡΓΙΑ ΕΡΓΑΣΙΑΣ">

         </form>
       </div>`;

  initDatePickers(modal);
  modal.style.display = "block";
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.innerHTML = "";
    modal.style.display = "none";
  };
  document.querySelector("#new_offer").addEventListener("click", function () {
    addOffer();
    modal.innerHTML = "";
    modal.style.display = "none";
  });
  document.querySelector("#new_job").addEventListener("click", function () {
    createJob();
    modal.innerHTML = "";
    modal.style.display = "none";
  });

  document.querySelector("#show_package").addEventListener("click", function () {
    let package_data=document.querySelector(".offer_form [name='package']").value;
    show_offer_package(package_data);
  });
}



function show_offer_print_preview(offer_data){
  let payments_window=document.querySelector("#OfferPackageModal");
  var background_image;
  var title;
  if(offer_data.offer_type=="gamos"){
    background_image="/images/offer_PDF_gamos.png";
    title="ΓΑΜΟΥ";
  }
  else{
    background_image="/images/offer_PDF_baptisi.png";
    title="ΒΑΠΤΙΣΗΣ";
  }
  var items;
  if(!offer_data.offer_package){
    console.log("empty package")
  }
  else{
    items=PackageItemList(offer_data.offer_package);
  }
  console.log(items);

  let today=new Date(offer_data.date).toUTCString();
  let time=offer_data.date.split('T')[1].split('.')[0];
  
  var formated_date=new Date(today).getDate().toString()+'-'+(new Date(today).getMonth()+1).toString()+'-'+new Date(today).getFullYear().toString()+" "+time;

  var anHTML=`<div id="pdf-modal" class="modal-content">
  
  
  <div class="pdf-container">
    <div class="pdf-preview-title"> <div class="preview-title">Προεπισκόπηση</div> <div class="pdf-preview-close">&times;</div></div>
    <div class="offer_pdf">
    <img src="${background_image}" alt="404 ERROR">
    <div class="offer_package"> 
    <div>ΠΡΟΣΦΟΡΑ ${title}</div>
      <ul>`


  for(let product of items[0]){
    anHTML+=`<li>${product.quantity} ${product.name}</li>`
  }
  anHTML+=`</ul>
           <div>ΔΩΡΟ</div>
           <ul>`

  for(let gift of items[1]){
    anHTML+=`<li>${gift.quantity} ${gift.name}</li>`
  }


  anHTML+=
  `
      </ul>
    </div>
    <div class="offer_details">
      <h2 style="text-decoration: underline;"> &#160&#160&#160&#160ΣΤΟΙΧΕΙΑ&#160&#160&#160&#160  </h2>
      <div>ΟΝΟΜΑΤΕΠΩΝΥΜΟ: ${offer_data.name1}</div>
      <div>ΤΗΛΕΦΩΝΟ: ${offer_data.phone}</div>
      <div>EMAIL: </div>
      <div>ΕΚΚΛΗΣΙΑ: ${offer_data.church}</div>
      <div>ΩΡΑ ΜΥΣΤΗΡΙΟΥ: ${formated_date}</div>
      <div>ΔΕΞΙΩΣΗ: ${offer_data.EventLocation}</div>
    </div>
    <div class="offer_price">Συνολο: ${offer_data.price}€</div>
    </div>
    <input id="print_offer" type="button" value="Δημιουργία PDF" style="background-color:white; color:black; border:2px solid black;">
  </div>
  

  `;

  
  anHTML += "</div>";
  payments_window.innerHTML=anHTML;
  var html = '<html><head></head><body>'+anHTML+'</body></html>';
  var uri = "data:text/html," + encodeURIComponent(html);
  var newWindow = window.open();
  newWindow.document.write(uri);

  payments_window.style.display = "block";
  var settings_window=document.querySelector("#OfferPDFSettingsModal");
  settings_window.style.display = "block";
  var x = document.querySelector(".pdf-preview-close");
  x.onclick = function () {
    payments_window.innerHTML = "";
    payments_window.style.display = "none";
    settings_window.innerHTML = "";
    settings_window.style.display = "none";
  };

  anHTML=`
  <div class="pdf-settings-containter" >
  <h3>Ρυθμίσεις</h3>
  <form>
    <label for="package-sideways">Προσφορά Οριζόντια</label>
    <input type="number" id="package-sideways" name="package-sideways" placeholder="0" value="${parseInt(window.getComputedStyle(document.querySelector(".offer_package")).left)}">
    
    <label for="package-vertical">Προσφορά Κάθετα</label>
    <input type="number" id="package-vertical" name="package-vertical" placeholder="0" value="${parseInt(window.getComputedStyle(document.querySelector(".offer_package")).top)}">

    <label for="price-sideways">Τιμή Οριζόντια</label>
    <input type="number" id="price-sideways" name="price-sideways" placeholder="0" value="${parseInt(window.getComputedStyle(document.querySelector(".offer_price")).left)}">
    
    <label for="price-vertical">Τιμή Κάθετα</label>
    <input type="number" id="price-vertical" name="price-vertical" placeholder="0" value="${parseInt(window.getComputedStyle(document.querySelector(".offer_price")).top)}">

    <label for="details-sideways">Πληροφορίες Οριζόντια</label>
    <input type="number" id="details-sideways" name="details-sideways" placeholder="0" value="${parseInt(window.getComputedStyle(document.querySelector(".offer_details")).left)}">
    
    <label for="details-vertical">Πληροφορίες Κάθετα</label>
    <input type="number" id="details-vertical" name="details-vertical" placeholder="0" value="${parseInt(window.getComputedStyle(document.querySelector(".offer_details")).top)}">
        
  </form>
  </div>
  
  `

  settings_window.innerHTML =anHTML;
  document.querySelector("#print_offer").addEventListener("click",function () {
    var pdf= document.querySelector(".offer_pdf");
    let mypromise= new Promise(function(resolve,reject){
      
      //scale();
      console.log("print");

      if(1){
        resolve("ok");
      }
      else{
        reject("error");
      }
      
    })
    
    mypromise.then(()=>{print_offer_pdf(offer_data,pdf);})
             .then(()=>{//pdf.classList.remove("big");
              
             })
              .catch((error)=>{console.log(error);})
    


  });

  document.querySelector("#package-sideways").addEventListener("change", function (){
    document.querySelector(".offer_package").style.left= document.querySelector("#package-sideways").value +"px";
  })

  document.querySelector("#package-vertical").addEventListener("change", function (){
    document.querySelector(".offer_package").style.top= document.querySelector("#package-vertical").value +"px";
  })

  document.querySelector("#details-sideways").addEventListener("change", function (){
    document.querySelector(".offer_details").style.left= document.querySelector("#details-sideways").value +"px";
  })

  document.querySelector("#details-vertical").addEventListener("change", function (){
    document.querySelector(".offer_details").style.top= document.querySelector("#details-vertical").value +"px";
  })

  document.querySelector("#price-sideways").addEventListener("change", function (){
    document.querySelector(".offer_price").style.left= document.querySelector("#price-sideways").value +"px";
  })

  document.querySelector("#price-vertical").addEventListener("change", function (){
    document.querySelector(".offer_price").style.top= document.querySelector("#price-vertical").value +"px";
  })
}

function print_offer_pdf(offer_data,pdf){
  var opt = {
    pagebreak: { mode: ['css'] },
    margin:       1,
    filename:     offer_data.offer_name+offer_data.date.split('T')[0]+".pdf",
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale:2 },
    jsPDF:        { unit: 'cm', format: "a4", orientation: 'p' }
  };
  
  html2pdf().set(opt).from(pdf).save();
}

function scale(){
  document.querySelector(".offer_pdf").classList.add("big");
  document.querySelectorAll(".offer_package ul li").classList.add("letters-big");
  document.querySelectorAll(".offer_details div").classList.add("letters-big");
  document.querySelectorAll(".offer_package div").classList.add("titles-big");
}


