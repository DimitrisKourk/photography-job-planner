window.history.replaceState({}, "", window.location.href.split("#")[0])
var MyAssociates=[];
getAssociates(); //gets associates table and saves it in MyAssociates
var MyProducts=[];
getProducts();//gets products table and saves it in MyProducts

//object for saving all necessary dashboard variables
var myDashboard={
  Baptism_number:0,
  Wedding_number:0,
  Photo_number:0,
  Baptism_total_income:0,
  Wedding_total_income:0,
  Photo_total_income:0,
  Baptism_payments:0,
  Wedding_payments:0,
  Photo_payments:0,
  Baptism_unpaid:0,
  Wedding_unpaid:0,
  Photo_unpaid:0,
  Baptism_expenses:0,
  Wedding_expenses:0,
  Photo_expenses:0,
  Employ_payments_expenses:0,
  Editor_payments_expenses:0,
  Printer_payments_expenses:0,
  monthlyIncome:[0,0,0,0,0,0,0,0,0,0,0,0],
  monthlyExpenses:[0,0,0,0,0,0,0,0,0,0,0,0],
  monthlyPaymentsExpenses:[0,0,0,0,0,0,0,0,0,0,0,0],
  monthlyEditorExpenses:[0,0,0,0,0,0,0,0,0,0,0,0],
  monthlyPrinterExpenses:[0,0,0,0,0,0,0,0,0,0,0,0],
  Baptism_package_cost:0,
  Wedding_package_cost:0,
  Photo_package_cost:0,
};

// setting filter to current month and year
var today=new Date().toUTCString();
let yearFilter= new Date(today).getFullYear();
let monthFilter= new Date(today).getMonth();
document.querySelector("[name='yearFilter']").value=yearFilter;
document.querySelector("[name='monthFilter']").value=monthFilter+1;


getJobCards(); // default screen on page load showing current jobs

document.querySelector(".logo").addEventListener("click",function(){
  var location=(window.location.href).split('#')[0];
  window.location.href=location;
  show_hide_date_filter(1);
  getJobCards();
});

document.querySelector("#home").addEventListener("click",function(){
  var location=(window.location.href).split('#')[0];
  window.location.href=location;
  show_hide_date_filter(1);
  getJobCards();
});

// filter functionality

document.querySelector("[name='monthFilter']").addEventListener("change",filter);

function filter(){
  var location=(window.location.href).split('#')[1];

  if(location=="prosfores"){
    getOfferCards();
  }
  else if(location=="ergasies"){
    getJobStatus();
  }
  else if(location=="arxeio"){
    let filter= document.querySelector("[name='filter']").value;
    if(filter=="jobs"){
      getArchivedJobs();    }
    else if(filter=="offers"){
      getArchivedOffers();
    }
  }
  else if(location=="diathesimotita"){
    getAvailability();
  }
  else if(location=="oikonomika"){

  }
  else {getJobCards();}
}

// nav bar functionality initialization
(function menu_nav() {
  function init() {
    var menu = document.getElementById("bt-menu"),
      trigger = menu.querySelector("a.bt-menu-trigger"),
      // triggerPlay only for demo 6
      triggerPlay = document.querySelector("a.bt-menu-trigger-out"),
      resetMenu = function () {
        classie.remove(menu, "bt-menu-open");
        classie.add(menu, "bt-menu-close");
      },
      closeClickFn = function (ev) {
        resetMenu();
        overlay.removeEventListener("click", closeClickFn);
      };

    var overlay = document.createElement("div");
    overlay.className = "bt-overlay";
    menu.appendChild(overlay);

    trigger.addEventListener("click", function (ev) {
      ev.stopPropagation();
      ev.preventDefault();

      if (classie.has(menu, "bt-menu-open")) {
        resetMenu();
      } else {
        classie.remove(menu, "bt-menu-close");
        classie.add(menu, "bt-menu-open");
        overlay.addEventListener("click", closeClickFn);
      }
    });

    if (triggerPlay) {
      triggerPlay.addEventListener("click", function (ev) {
        ev.stopPropagation();
        ev.preventDefault();

        classie.remove(menu, "bt-menu-close");
        classie.add(menu, "bt-menu-open");
        overlay.addEventListener("click", closeClickFn);
      });
    }
  }

  init();
})();


function show_offer_package(fullpackage){
  package_window=document.querySelector("#OfferPackageModal");
  var offer_package=fullpackage.split('-')[0];
  offer_package=offer_package.split(',');
  console.log(fullpackage);
  var ProductSelection="";

  for( let product of MyProducts){
    ProductSelection+=`<option value=${product.id}>${product.product_name}</option>`;
  }

  var package_cost;
  // use !fullpackage to check for null
  if(fullpackage && fullpackage!=="-"){
    package_cost=PackageCostCalculator(fullpackage);
  }
  else package_cost=0;
  
  var anHTML=`<div class="modal-content">
  <span class="close close2">&times;</span>
  <h3>ΠΑΚΕΤΟ</h3>
  <input name="change_package" id="change_package" type="button" value="Αλλαγή">
  <h4>Συνολικό Κόστος: ${package_cost}</h4>

  <ul id="package_list" style="list-style-type: none;">`;

  var length=0;
  if(offer_package!==""){
    length=offer_package.length;
  }

  let j=0;// traversing the package string
  for(let i=0;i<length/2;i++){
    anHTML+=`<li>
      <h4>Προϊόν ${i+1}</h4>
      <div class="product-container">
        <label for="product_name${i}">Κωδικός</label>
        <select name="product_name${i}" style="width:min-content; background-color:white;">${ProductSelection}</select>
        <label for="product_quantity${i}">Ποσότητα</label>
        <input type="number" name="product_quantity${i}" style="width:min-content" value=${offer_package[j]} >
      </div>
      </li>`;
    j+=2;
  }

  anHTML+=`</ul>
          <input name="add_product" id="add_product" type="button" value="Προσθήκη" style="width:80%; background-color:grey">
          <input name="remove_product" id="remove_product" type="button" value="Αφαίρεση" style="width:18%; background-color:#FF5733 ">
         `;
        
  var gifts='';
  
  if(fullpackage.split('-')[1]){
    gifts=fullpackage.split('-')[1];
    gifts=gifts.split(',');
  }
  //console.log(gifts);
   anHTML+=`
  <h3>ΔΩΡΟ</h3>
  <ul id="gift_list" style="list-style-type: none;">`;

  length=0;
  if(gifts!==""){
    length=gifts.length;
  }

  j=0;// traversing the gifts string
  for(let i=0;i<length/2;i++){
    anHTML+=`<li>
      <h4>Προϊόν ${i+1}</h4>
      <div class="product-container">
        <label for="gift_name${i}">Κωδικός</label>
        <select name="gift_name${i}" style="width:min-content; background-color:white;">${ProductSelection}</select>
        <label for="gift_quantity${i}">Ποσότητα</label>
        <input type="number" name="gift_quantity${i}" style="width:min-content" value=${gifts[j]} >
      </div>
      </li>`;
    j+=2;
  }

  anHTML+=`</ul>
          <input name="add_gift" id="add_gift" type="button" value="Προσθήκη" style="width:80%; background-color:grey">
          <input name="remove_gift" id="remove_gift" type="button" value="Αφαίρεση" style="width:18%; background-color:#FF5733 ">
        </div> `;
        
  package_window.innerHTML=anHTML;

  length=offer_package.length;
  let products_select=[];
  for(let i=0;i<length/2;i++){
    let text=`#OfferPackageModal .modal-content #package_list li [name='product_name${i}']`;
    var product=document.querySelector(text);
    products_select.push(product);
    
  }
  //console.log(products_select);

  if(products_select[0]!==null){
    let j=1;// traversing package on object id
    for(let i=0;i<products_select.length;i++){
      products_select[i].value=offer_package[j]
      j+=2;
    }
  }
  length=gifts.length;

  products_select=[];
  for(let i=0;i<length/2;i++){
    let text=`#OfferPackageModal .modal-content #gift_list li [name='gift_name${i}']`;
    var product=document.querySelector(text);
    products_select.push(product);
  }

  //console.log(products_select);
  if(products_select[0]!=null){
    let j=1;// traversing package on object id
    for(let i=0;i<products_select.length;i++){
      products_select[i].value=gifts[j];
      j+=2;
    }
  }


  package_window.style.display = "block";
  var span = document.getElementsByClassName("close2")[0];
  span.onclick = function () {
    package_window.innerHTML = "";
    package_window.style.display = "none";
  };
  document.querySelector("#change_package").addEventListener("click",()=>{
    var data=getPackageFormData();
    document.querySelector(".offer_form [name='package']").value=data;
  });

  document.querySelector("#add_product").addEventListener("click",function (){
    addItemToProductList();
  });
  document.querySelector("#remove_product").addEventListener("click",function (){
    let list=document.querySelector("#OfferPackageModal .modal-content #package_list");
    list.removeChild(list.lastElementChild);
    console.log("removed");
  });

  document.querySelector("#add_gift").addEventListener("click",function (){
    addItemToGiftList();
  });
  document.querySelector("#remove_gift").addEventListener("click",function (){
    let list=document.querySelector("#OfferPackageModal .modal-content #gift_list");
    list.removeChild(list.lastElementChild);
    console.log("removed");
  });
}


function addItemToProductList(){
  var Selection="";
  for(product of MyProducts){
    Selection+=`<option value=${product.id}>${product.product_name}</option>`;
  }

  let length=document.querySelectorAll("#OfferPackageModal .modal-content #package_list li").length;
  anHTML=`
  <li>
      <h4>Προϊόν ${length+1}</h4>
      <div class="product-container">
        <label for="product_name${length}">Κωδικός</label>
        <select name="product_name${length}" style="width:min-content; background-color:white;">${Selection}</select>
        <label for="product_quantity${length}">Ποσότητα</label>
        <input type="number" name="product_quantity${length}" style="width:min-content">
      </div>
      </li>
  `;
  let list=document.querySelector("#OfferPackageModal .modal-content #package_list");
  if(length>0){ 
    list.insertAdjacentHTML("beforeend",anHTML);
  }
  else{
    list.innerHTML=anHTML;
  }
}

function addItemToGiftList(){
  var Selection="";
  for(product of MyProducts){
    Selection+=`<option value=${product.id}>${product.product_name}</option>`;
  }

  let length=document.querySelectorAll("#OfferPackageModal .modal-content #gift_list li").length;
  anHTML=`
  <li>
      <h4>Προϊόν ${length+1}</h4>
      <div class="product-container">
        <label for="gift_name${length}">Κωδικός</label>
        <select name="gift_name${length}" style="width:min-content; background-color:white;">${Selection}</select>
        <label for="gift_quantity${length}">Ποσότητα</label>
        <input type="number" name="gift_quantity${length}" style="width:min-content">
      </div>
      </li>
  `;
  let list=document.querySelector("#OfferPackageModal .modal-content #gift_list");
  if(length>0){ 
    list.insertAdjacentHTML("beforeend",anHTML);
  }
  else{
    list.innerHTML=anHTML;
  }
}

function getPackageFormData(){
  let data="";
  let length=document.querySelectorAll("#OfferPackageModal .modal-content #package_list li").length;

  for(let i=0;i<length;i++){
    let text=`#OfferPackageModal .modal-content #package_list li [name='product_name${i}']`;
    var product_name=document.querySelector(text);
    text=`#OfferPackageModal .modal-content #package_list li [name='product_quantity${i}']`;
    var product_quantity=document.querySelector(text);

    if(i!=0){data+=","}
    data+=product_quantity.value;
    data+=",";
    data+=product_name.value;
  }
  data+='-';

  length=document.querySelectorAll("#OfferPackageModal .modal-content #gift_list li").length;

  for(let i=0;i<length;i++){
    let text=`#OfferPackageModal .modal-content #gift_list li [name='gift_name${i}']`;
    var gift_name=document.querySelector(text);
    text=`#OfferPackageModal .modal-content #gift_list li [name='gift_quantity${i}']`;
    var gift_quantity=document.querySelector(text);

    if(i!=0){data+=","}
    data+=gift_quantity.value;
    data+=",";
    data+=gift_name.value;
  }
  console.log(data);
  return data;
}
function PackageItemList(package){
  let product_list=[];
  let gift_list=[];
  if (package===null){
    return 0;
  }
  else{
    
    let gifts=package.split('-')[1];
    let products=package.split('-')[0];
    
    if (products.length!=0){
      products=products.split(',');
      for(let i=0;i<products.length;i+=2){
        const product_id=products[i+1];
        let product=MyProducts.find(product => product.id==product_id);
        let item={
          quantity:products[i],
          name:product.product_name
        }
        product_list.push(item);
      }
    }
    if (gifts.length!=0){
      gifts=gifts.split(',');
      for(let i=0;i<gifts.length;i+=2){
        const gift_id=gifts[i+1];
        let gift=MyProducts.find(gift => gift.id==gift_id);
        let item={
          quantity:gifts[i],
          name:gift.product_name
        }
        gift_list.push(item);
      }
    }
    
  }
  return [product_list,gift_list];
}
function PackageCostCalculator(package){
  
  if(package){
    let product_list=[];
    let gifts=package.split('-')[1];
    if (gifts.length==0){ //check if gift list has items
      package=package.split('-')[0];
    }
    else{
      package=package.replace('-',','); // combine gifts and products lists
    }
    package=package.split(',');
    //console.log(package);
    for(let i=0;i<package.length;i+=2){
      const product_id=package[i+1];
      let product=MyProducts.find(product => product.id==product_id);
      console.log(product.price);
      let item={
        quantity:package[i],
        id:package[i+1],
        cost: package[i]*product.price
      }
      product_list.push(item);
    }
    var package_cost=0;
    for(let product of product_list){
      package_cost+=product.cost;
    }
    //console.log(product_list);
    //console.log(package_cost);
    return package_cost;
  } 
  else{
     return 0; 
  }
}


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
          <input type="text" id="groom_place" name="bride_place" value="${current_job.bride_place}" style="width:min-content">
          <input type="time" id="groom_time" name="bride_time" value="${current_job.bride_time}" style="width:min-content">
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
     <button class="collapsible">ΕΡΓΑΣΙΕΣ</button>
     <div class="content">
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
     <input id="update_job" type="button" value="Αποθήκευση">
     <input id="archive_job" type="button" value="Αρχειοθέτηση">
     <input id="add_to_Calendar" type="button" value="Προσθήκη στο Ημερολόγιο" style="background-color:#213A5C">
     <input id="show_payments" type="button" value="Προβολή Πληρωμών">

    </div>
  
  </div>`;
  fill_form(current_job);
  make_checklist_events();
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
  document.querySelector("#show_payments").addEventListener("click", function () {
    getPayments(current_job.id,"",current_job.price);
  });
  
  
  document.querySelector("#show_pdf").addEventListener("click", function () {
    
    show_pdf("job",current_job.id,current_job.pdf);
  });
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
    list_items[8].classList.add("selected");
    list_items[8].classList.add("checked");
  }
  if (current_job.task11) {
    list_items[8].classList.add("selected");
    list_items[8].classList.add("checked");
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

function make_checklist_events() {
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
  // Add a "checked" symbol when clicking on a list item
  var list = document.querySelector(".modal ul");
  list.addEventListener(
    "click",
    function (ev) {
      if (ev.target.tagName === "LI") {
        ev.target.classList.toggle("checked");
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


document.querySelector(".settings img").addEventListener("click", function () {
  open_settings();
});

function open_settings() {
  let anHTML = `<div class="modal-content">
         <span class="close">&times;</span>
<input id="associates-btn" type="button" value="Συνεργάτες">
<input id="prices-btn" type="button" value="Τιμοκατάλογος">
<input id="schedule-btn" type="button" value="Πρόγραμμα">
<input id="general-btn" type="button" value="Γενικά">

<div id="SettingsTabContent">

</div>

</div>`;
         
  
  modal.innerHTML = anHTML;
  modal.style.display = "block";
  document.querySelector(".modal-content #associates-btn").addEventListener("click", function() {getAssociates("maketable");});
  document.querySelector(".modal-content #prices-btn").addEventListener("click", function (){getProducts("maketable");});
  document.querySelector(".modal-content #schedule-btn").addEventListener("click", function (){getJobSchedule();});
  document.querySelector(".modal-content #general-btn").addEventListener("click", function (){});
  document.querySelector(".modal-content #associates-btn").dispatchEvent(new CustomEvent("click"));
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function (){
    modal.innerHTML = "";
    modal.style.display = "none";
  };
}

document.querySelector(".FloatCalendar").addEventListener("click", async function () {
  // the calendar id comes from the server config, so it is not hardcoded here
  let calendarId = null;
  try {
    const res = await fetch("/api/config/calendar");
    if (res.ok) calendarId = (await res.json()).calendarId;
  } catch (err) {
    console.log(err);
  }
  const calendarHTML = calendarId
    ? `<iframe src="https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=Europe%2FAthens" style="border:solid 1px #777" width="90%" height="500vh" frameborder="0" scrolling="no"></iframe>`
    : `<p>Google Calendar is not configured for this installation.</p>`;
  let anHTML = `<div class="modal-content">
                 <span class="close">&times;</span>
                 <div class="calendar">
                 ${calendarHTML}
                 </div>
               </div>`;
  modal.innerHTML = anHTML;
  modal.style.display = "block";
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.innerHTML = "";
    modal.style.display = "none";
  };
});


function make_associates_table(Associates){
  content=document.querySelector(".modal-content #SettingsTabContent");
  let anHTML=`<h2>Πίνακας Συνεργατών</h2>
    <div class="tableContainer">
      <table id="Associates_table"><tr><th>ΚΩΔΙΚΟΣ</th><th>ΟΝΟΜΑ</th><th>ΕΠΩΝΥΜΟ</th><th>ΕΙΔΙΚΟΤΗΤΑ</th><th>E-MAIL</th><th>ΤΗΛΕΦΩΝΟ</th></tr>`;
  for (let associate of Associates){
    anHTML += `<tr>
       <td>${associate.id}</td>
       <td>${associate.firstname}</td>
       <td>${associate.surname}</td>
       <td>${associate.associate_type}</td>
       <td>${associate.email}</td>
       <td>${associate.phone}</td>
       </tr>`;
  }
  anHTML+="</table></div>";

  anHTML+=`<button class="collapsible">Επεξεργασία</button>
     
    <div class="content">
    <form class="associate_form">
      <ul style="list-style-type: none;">
        <li>
          <label for="associate_id">Κωδικός</label>
          <input type="number" id="associate_id" name="associate_id" placeholder="Κωδικός..." >
        </li>
        <li>
          <label for="associate_name">Όνομα</label>
          <input type="text" id="associate_name" name="associate_name" placeholder="Όνομα..." >
        </li>
        <li>  
          <label for="associate_surname">Επώνυμο</label>
          <input type="text" id="associate_surname" name="associate_surname" placeholder="Επώνυμο..." >
        </li>
        <li>
          <label for="type">Ειδικότητα</label>
                     <div class="custom-select" >
                         <select name="type">
                             <option value="" selected="selected" hidden="hidden">ΕΠΙΛΟΓΗ</option>
                             <option value="Φωτογράφος">Φωτογράφος</option>
                             <option value="Βιντεογράφος">Βιντεογράφος</option>
                             <option value="Μοντάζ">Μοντάζ</option>
                             <option value="Άλμπουμ">Άλμπουμ</option>
                             <option value="Drone">Drone</option>
                             <option value="Λογιστής">Λογιστής </option>
                         </select>
                     </div>
        </li>
        <li>
          <label for="email">Email</label>
          <input type="text" id="email" name="email" placeholder="E-mail..." >
        </li>
        <li>
          <label for="phone">Τηλέφωνο</label>
          <input type="text" id="phone" name="phone" placeholder="Τηλέφωνο...">
        </li>
      </ul>
      </form>
      <input id="new_associate" type="button" value="Προσθήκη Νέου">
     <input id="update_associate" type="button" value="Αλλαγή">
     </div>  
    `;
  
  content.innerHTML=anHTML;

  document.querySelector(".modal-content #SettingsTabContent .collapsible").addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });

  document.querySelector("#new_associate").addEventListener("click", function () {
    addAssociate()
  });
  document.querySelector("#update_associate").addEventListener("click", function () {
    updateAssociate();
  });
  document.querySelector("#Associates_table").addEventListener("click", selectAssociate);
}

function selectAssociate(event) {
  if (!event.target.outerHTML.startsWith("<td>")) return;
  let aRow = event.target.parentNode;
  let inputs = document.querySelectorAll(".associate_form input");
  for (let i = 0; i < inputs.length; i++) {
    if(i>=3) {
      inputs[i].value = aRow.children[i+1].innerText;
    }
    else{inputs[i].value = aRow.children[i].innerText;}
  }
  let rows = [...aRow.parentNode.children];
  rows.forEach((r) => r.classList.remove("selected"));
  aRow.classList.add("selected");
  document.querySelector(".associate_form select").value=aRow.children[3].innerText;
}

function getAssociateFormData(action) {
  var Offer;
  if(action=="add"){
    Offer = {
      firstname: document.querySelector(".associate_form [name='associate_name']").value,
      surname: document.querySelector(".associate_form [name='associate_surname']").value,
      associate_type: document.querySelector(".associate_form [name='type']").value,
      email: document.querySelector(".associate_form [name='email']").value,
      phone: document.querySelector(".associate_form [name='phone']").value
    };
  } 
  else if (action=="update"){
    Offer = {
      id: document.querySelector(".associate_form [name='associate_id']").value,
      firstname: document.querySelector(".associate_form [name='associate_name']").value,
      surname: document.querySelector(".associate_form [name='associate_surname']").value,
      associate_type: document.querySelector(".associate_form [name='type']").value,
      email: document.querySelector(".associate_form [name='email']").value,
      phone: document.querySelector(".associate_form [name='phone']").value
    };
  }
  
  return JSON.stringify(Offer);
}

function make_products_table(ProductTable){
  content=document.querySelector(".modal-content #SettingsTabContent");
  let anHTML=`<h2>Τιμοκατάλογος</h2>
    <div class="tableContainer">
      <table id="Products_table"><tr><th>ΚΩΔΙΚΟΣ</th><th>ΟΝΟΜΑ</th><th>ΤΙΜΗ</th></tr>`;
  for (let product of ProductTable){
    anHTML += `<tr>
       <td>${product.id}</td>
       <td>${product.product_name}</td>
       <td>${product.price}</td>
       </tr>`;
  }
  anHTML+="</table></div>";

  anHTML+=`<button class="collapsible">Επεξεργασία</button>
     
    <div class="content">
    <form class="product_form">
      <ul style="list-style-type: none;">
        <li>
          <label for="product_id">Κωδικός</label>
          <input type="number" id="product_id" name="product_id" placeholder="Κωδικός..." >
        </li>
        <li>
          <label for="product_name">Όνομα</label>
          <input type="text" id="product_name" name="product_name" placeholder="Όνομα..." >
        </li>
        <li>  
          <label for="product_price">Τιμή</label>
          <input type="number" step="0.01" min="0" max="1000" id="product_price" name="product_price" placeholder="Τιμή..." >
        </li>
      </ul>
      </form>
      <input id="new_product" type="button" value="Προσθήκη Νέου">
     <input id="update_product" type="button" value="Αλλαγή">
     </div>  
    `;
  
  content.innerHTML=anHTML;

  document.querySelector(".modal-content #SettingsTabContent .collapsible").addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });

  document.querySelector("#new_product").addEventListener("click", function () {
    addProduct()
  });
  document.querySelector("#update_product").addEventListener("click", function () {
    updateProduct();
  });
  document.querySelector("#Products_table").addEventListener("click", selectProduct);
}

function selectProduct(event) {
  if (!event.target.outerHTML.startsWith("<td>")) return;
  let aRow = event.target.parentNode;
  let inputs = document.querySelectorAll(".product_form input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = aRow.children[i].innerText;
  }
  let rows = [...aRow.parentNode.children];
  rows.forEach((r) => r.classList.remove("selected"));
  aRow.classList.add("selected");
}

function getProductFormData() {
  var Product;
  Product = {
      id: document.querySelector(".product_form [name='product_id']").value,
      product_name: document.querySelector(".product_form [name='product_name']").value,
      price: document.querySelector(".product_form [name='product_price']").value,
    };
  return JSON.stringify(Product);
}
function getDateFilter(){
  var year=document.querySelector("[name='yearFilter']").value;
  var month=document.querySelector("[name='monthFilter']").value;
  return year+','+month;
}

function getJobEventData(){
  /*var employees=[];
  var photographer1_id=document.querySelector(" ul li [name='ΦΩΤΟΓΡΑΦΟΣ1']").value;
  if(photographer1_id!=''){
    var ph1=MyAssociates.filter(function(person){return person.id==photographer1_id})[0];
    employees.push(ph1.email);
  }

  var photographer2_id=document.querySelector(" ul li [name='ΦΩΤΟΓΡΑΦΟΣ2']").value;
  if(photographer2_id!=''){
    var ph2=MyAssociates.filter(function(person){return person.id==photographer2_id})[0];
    employees.push(ph2.email);
  }

  var videographer1_id=document.querySelector(" ul li [name='ΒΙΝΤΕΟΓΡΑΦΟΣ1']").value;
  if(videographer1_id!=''){
    var vd1=MyAssociates.filter(function(person){return person.id==videographer1_id})[0];
    employees.push(vd1.email);
  }
  var videographer2_id=document.querySelector(" ul li [name='ΒΙΝΤΕΟΓΡΑΦΟΣ2']").value;
  if(videographer2_id!=''){
    var vd2=MyAssociates.filter(function(person){return person.id==videographer2_id})[0];
    employees.push(vd2.email);
  }
  let employees_no_duplicates= uniq(employees);  
  */


  var event_summary=document.querySelector(".offer_form [name='type']").selectedOptions[0].text +" "+ document.querySelector(".offer_form [name='job_name']").value;
  var event_location=document.querySelector(".offer_form [name='jobplace']").value;

  var date=document.querySelector(".offer_form [name='jobdate']");
  var my_date=new Date(date.value);
  var event_start=my_date.toISOString();
  my_date.setHours(my_date.getHours()+1);
  var event_end= my_date.toISOString();
  
  
  var EventData={
    summary:event_summary,
    location:event_location,
    start:event_start,
    end: event_end,
    //attendees:employees_no_duplicates
  }

  return JSON.stringify(EventData);
}
function uniq(a) {
  return Array.from(new Set(a));
}

function getJobFormData() {
  var tasksStatus=check_To_Do_list();
  let Job = { 
    job_type: document.querySelector(".offer_form [name='type']").value,
    job_name: document.querySelector(".offer_form [name='job_name']").value,
    name1: document.querySelector(".offer_form [name='fullname1']").value,
    name2: document.querySelector(".offer_form [name='fullname2']").value,
    phone: document.querySelector(".offer_form [name='phone']").value,
    church: document.querySelector(".offer_form [name='jobplace']").value,
    EventLocation: document.querySelector(".offer_form [name='EventLocation']").value,
    date: document.querySelector(".offer_form [name='jobdate']").value.replace("T"," "),
    groom_place:document.querySelector(".offer_form [name='groom_place']").value,
    groom_time:document.querySelector(".offer_form [name='groom_time']").value,
    bride_place:document.querySelector(".offer_form [name='bride_place']").value,
    bride_time:document.querySelector(".offer_form [name='bride_time']").value,
    offer_package: document.querySelector(".offer_form [name='package']").value,
    price: document.querySelector(".offer_form [name='price']").value,
    description: document.querySelector(".offer_form [name='description']").value,
    task1: tasksStatus[0],
    task2: tasksStatus[1],
    task3: tasksStatus[2],
    task4: tasksStatus[3],
    task5: tasksStatus[4],
    task6: tasksStatus[5],
    task7: tasksStatus[6],
    task8: tasksStatus[7],
    task9: tasksStatus[8],
    task10: tasksStatus[9],
    task11: tasksStatus[10],

    photographer1:(document.querySelector(" ul li [name='ΦΩΤΟΓΡΑΦΟΣ1']").value!=''?document.querySelector(" ul li [name='ΦΩΤΟΓΡΑΦΟΣ1']").value : null),
    photographer2:(document.querySelector(" ul li [name='ΦΩΤΟΓΡΑΦΟΣ2']").value!=''?document.querySelector(" ul li [name='ΦΩΤΟΓΡΑΦΟΣ2']").value : null),
    videographer1:(document.querySelector(" ul li [name='ΒΙΝΤΕΟΓΡΑΦΟΣ1']").value!=''?document.querySelector(" ul li [name='ΒΙΝΤΕΟΓΡΑΦΟΣ1']").value : null),
    videographer2:(document.querySelector(" ul li [name='ΒΙΝΤΕΟΓΡΑΦΟΣ2']").value!=''?document.querySelector(" ul li [name='ΒΙΝΤΕΟΓΡΑΦΟΣ2']").value : null),
    album_printer:(document.querySelector(" ul li [name='ΕΚΤΥΠΩΣΗ']").value!=''?document.querySelector(" ul li [name='ΕΚΤΥΠΩΣΗ']").value : null),
    video_editor:(document.querySelector(" ul li [name='ΜΟΝΤΑΖ']").value!=''?document.querySelector(" ul li [name='ΜΟΝΤΑΖ']").value : null),
    drone:(document.querySelector(" ul li [name='Drone']").value!=''?document.querySelector(" ul li [name='Drone']").value : null),
    sent_to_editor:(document.querySelector(" ul li [name='EditSentDate']").value!=''?document.querySelector(" ul li [name='EditSentDate']").value : null),
    recieved_from_editor:(document.querySelector(" ul li [name='EditRecievedDate']").value!=''?document.querySelector(" ul li [name='EditRecievedDate']").value : null),
    sent_to_printer:(document.querySelector(" ul li [name='PrintSentDate']").value!=''?document.querySelector(" ul li [name='PrintSentDate']").value : null),
    recieved_from_printer:(document.querySelector(" ul li [name='PrintRecievedDate']").value!=''?document.querySelector(" ul li [name='PrintRecievedDate']").value : null),
    ph1_payment:document.querySelector("ul li [name='ph1_pay']").value,
    ph2_payment:document.querySelector("ul li [name='ph2_pay']").value,
    vid1_payment:document.querySelector("ul li [name='vd1_pay']").value,
    vid2_payment:document.querySelector("ul li [name='vd2_pay']").value,
    drone_payment:document.querySelector("ul li [name='drone_pay']").value,
    printer_payment:document.querySelector("ul li [name='printer_pay']").value,
    editor_payment:document.querySelector("ul li [name='editor_pay']").value,
    pdf: document.querySelector(".offer_form [name='pdf_file_name']").value,

    ph1_pay_done:document.querySelector("ul li [name='ph1_pay_done']").checked,
    ph2_pay_done:document.querySelector("ul li [name='ph2_pay_done']").checked,
    vid1_pay_done:document.querySelector("ul li [name='vd1_pay_done']").checked,
    vid2_pay_done:document.querySelector("ul li [name='vd2_pay_done']").checked,
    drone_pay_done:document.querySelector("ul li [name='drone_pay_done']").checked,
    printer_pay_done:document.querySelector("ul li [name='printer_pay_done']").checked,
    editor_pay_done:document.querySelector("ul li [name='editor_pay_done']").checked,
  };
  console.log(Job);
  return JSON.stringify(Job);
}

function check_To_Do_list(){
  var result=[0,0,0,0,0,0,0,0,0,0,0]
  var list_items = document.querySelectorAll(".to-do-list li");

  for (let i = 0; i <11; i++) {
    if(list_items[i].classList.contains("checked")){
      result[i]=1;
    }
  } 
  return result;
}

function getOfferFormData() {
  let Offer = {
    offer_type: document.querySelector(".offer_form [name='type']").value,
    offer_name: document.querySelector(".offer_form [name='job_name']").value,
    name1: document.querySelector(".offer_form [name='fullname1']").value,
    name2: document.querySelector(".offer_form [name='fullname2']").value,
    phone: document.querySelector(".offer_form [name='phone']").value,
    church: document.querySelector(".offer_form [name='jobplace']").value,
    EventLocation: document.querySelector(".offer_form [name='EventLocation']").value,
    date:   document.querySelector(".offer_form [name='jobdate']").value.replace("T"," "),
    offer_package:document.querySelector(".offer_form [name='package']").value,
    price: document.querySelector(".offer_form [name='price']").value,
    description: document.querySelector(".offer_form [name='description']").value,
    pdf: document.querySelector(".offer_form [name='pdf_file_name']").value,

  };
  return JSON.stringify(Offer);
}

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
          <input type="text" id="groom_place" name="bride_place" value="${current_job.bride_place}" style="width:min-content">
          <input type="time" id="groom_time" name="bride_time" value="${current_job.bride_time}" style="width:min-content">
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

document.querySelector("#dashboard").addEventListener("click",function(){
  document.querySelector("#PageTag").textContent = "ΟΙΚΟΝΟΜΙΚΑ";
  document.querySelector("#bt-menu a.bt-menu-trigger").click(); //closemenu
  show_hide_date_filter(0);//hide filter
  var loaderHtml=document.querySelector(".job-container");
  loaderHtml.innerHTML=`
  <div class="loader-container">
    <div class="loader">
      <div class="loader-wheel"></div>
      <div class="loader-text"></div>
    </div>
  </div>
  `
  getDashboardData(new Date(new Date().toUTCString()).getFullYear())});

  function makeDashboard(year){

    var container = document.querySelector(".job-container");
    container.innerHTML = "";// remove cards if they exist
  
    var today=new Date().toUTCString();
    
    var formated_date=new Date(today).getDate().toString()+'/'+(new Date(today).getMonth()+1).toString()+'/'+new Date(today).getFullYear().toString();
    var dashboard=document.querySelector(".job-container");
    var default_filter_year=year;
    dashboard.innerHTML+=`
    <div class="dashboard-container">
              <div class="Dashboard-filter-container">
                  <div class="Dashboard-filter-wrapper">
                    <input type="number" id="DashboardFilter" name="DashboardFilter" min="2004" max="2060"  value="${default_filter_year}">
                    <div class="Dashboard-filter-button-container">
                      <img src="images/down_arrow.png" class="DashboardfilterButton"></img>
                    </div>
                  </div>
                  <input id="employee-analytics" type="button" value="Αναλυτικά Συνεργατών">
              </div>
              <div class="dashboard-section">
                  <h2 class="overview">Έσοδα-Έξοδα-Εκρεμότητες</h2>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <th>ΤΥΠΟΣ</th> <th>ΠΟΣΟ</th></tr>
                       <tr> <td>ΕΣΟΔΑ</td> <td>${myDashboard.Baptism_payments+myDashboard.Wedding_payments+myDashboard.Photo_payments}</td></tr>
                       <tr> <td>ΕΚΚΡΕΜΟΤΗΤΕΣ</td><td>${myDashboard.Baptism_unpaid+myDashboard.Wedding_unpaid+myDashboard.Photo_unpaid}</td></tr>
                       <tr> <td>ΕΞΟΔΑ</td> <td>${myDashboard.Baptism_expenses+myDashboard.Wedding_expenses+myDashboard.Photo_expenses}</td></tr>                    
                    </table>
                  </div>
                  <div class="graph-container"><canvas id="overview-chart"></canvas></div>
              </div>
              <div class="dashboard-section">
                  <h2 class="overview">Εργασίες ανά Κατηγορία</h2>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <th>ΤΥΠΟΣ</th><th>ΑΡΙΘΜΟΣ</th></tr>
                       <tr> <td>Γάμοι</td><td>${myDashboard.Wedding_number}</td></tr>
                       <tr> <td>Βαπτίσεις</td><td>${myDashboard.Baptism_number}</td></tr>
                       <tr> <td>Άλλο</td><td>${myDashboard.Photo_number}</td></tr>                    
                    </table>
                  </div>
                  <div class="graph-container"><canvas id="jobs-per-category-chart"></canvas></div>
              </div>
              <div class="dashboard-section">
                  <h2 class="overview">Έσοδα ανά Κατηγορία</h2>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <th>ΤΥΠΟΣ</th><th>ΠΟΣΟ</th></tr>
                       <tr> <td>Γάμοι</td><td>${myDashboard.Wedding_total_income}</td></tr>
                       <tr> <td>Βαπτίσεις</td><td>${myDashboard.Baptism_total_income}</td></tr>
                       <tr> <td>Άλλο</td><td>${myDashboard.Photo_total_income}</td></tr>                    
                    </table>
                  </div>
                  <div class="graph-container"><canvas id="income-per-category-chart"></canvas></div>
              </div>
              <div class="dashboard-section">
                  <h2 class="overview">Έξοδα ανα Κατηγορία</h2>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <th>ΤΥΠΟΣ</th><th>ΠΟΣΟ</th></tr>
                       <tr> <td>Γάμοι</td><td>${myDashboard.Wedding_expenses}</td></tr>
                       <tr> <td>Βαπτίσεις</td><td>${myDashboard.Baptism_expenses}</td></tr>
                       <tr> <td>Άλλο</td><td>${myDashboard.Photo_expenses}</td></tr>                   
                    </table>
                  </div>
                  <div class="graph-container"><canvas id="expenses-per-category-chart"></canvas></div>
              </div>
              <div class="dashboard-section">
                  <h2 class="overview">Τύπος Εξόδων</h2>
                  <div class="table-container">
                    <table class="overview-table">
                      <tr> <th>ΤΥΠΟΣ</th> <th>ΠΟΣΟ</th></tr>
                       <tr> <td>Μεροκάματα</td> <td>${myDashboard.Employ_payments_expenses}</td></tr>
                       <tr> <td>Μοντάζ</td><td>${myDashboard.Editor_payments_expenses}</td></tr>
                       <tr> <td>Εκτυπώσεις</td><td>${myDashboard.Printer_payments_expenses}</td></tr>
                    </table>
                  </div>
                  <div class="graph-container"><canvas id="expenses-per-type-chart"></canvas></div>
              </div>
              
              <div class="dashboard-section big-table">
                  <h2 class="overview">Αναλυτικός Πίνακας<button id="dashboard_table_print"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
  </svg></button></h2>
                  <div class="table-container">
                    <table class="overview-table" id="printable-table">
                       <tr> <td>${formated_date}</td> <th>Αριθμός</th><th>Έσοδα</th><th>Εκκρεμότητες</th><th>Έξοδα</th></tr>
                       <tr> <th>Γάμοι</th> <td>${myDashboard.Wedding_number}</td><td>${myDashboard.Wedding_payments}</td><td>${myDashboard.Wedding_unpaid}</td><td>${myDashboard.Wedding_expenses}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Βαπτίσεις</th> <td>${myDashboard.Baptism_number}</td><td>${myDashboard.Baptism_payments}</td><td>${myDashboard.Baptism_unpaid}</td><td>${myDashboard.Baptism_expenses}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Άλλο</th> <td>${myDashboard.Photo_number}</td><td>${myDashboard.Photo_payments}</td><td>${myDashboard.Photo_unpaid}</td><td>${myDashboard.Photo_expenses}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td></tr> 
                       <tr> <th>Σύνολο</th> <td>${myDashboard.Wedding_number+myDashboard.Baptism_number+myDashboard.Photo_number}</td><td>${myDashboard.Wedding_payments+myDashboard.Baptism_payments+myDashboard.Photo_payments}</td><td>${myDashboard.Wedding_unpaid+myDashboard.Baptism_unpaid+myDashboard.Photo_unpaid}</td><td>${myDashboard.Wedding_expenses+myDashboard.Baptism_expenses+myDashboard.Photo_expenses}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td></tr>                
                    </table>
                  </div>
    </div>
     <div class="dashboard-section big-table" id="income-expenses-per-month">
                  <h2 class="overview"> Έσοδα-Έξοδα ανα Μήνα</h2>
                  <div class="graph-container"><canvas id="income-expenses-per-month-chart"></canvas></div>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <td></td> <th>Ιαν</th><th>Φεβ</th><th>Μαρ</th><th>Απρ</th><th>Μάι</th><th>Ιούν</th><th>Ιούλ</th><th>Αυγ</th><th>Σεπ</th><th>Οκτ</th><th>Νοέ</th><th>Δεκ</th></tr>
                       <tr> <th>Έσοδα</th> <td>${myDashboard.monthlyIncome[0]}</td><td>${myDashboard.monthlyIncome[1]}</td><td>${myDashboard.monthlyIncome[2]}</td><td>${myDashboard.monthlyIncome[3]}</td><td>${myDashboard.monthlyIncome[4]}</td><td>${myDashboard.monthlyIncome[5]}</td><td>${myDashboard.monthlyIncome[6]}</td><td>${myDashboard.monthlyIncome[7]}</td><td>${myDashboard.monthlyIncome[8]}</td><td>${myDashboard.monthlyIncome[9]}</td><td>${myDashboard.monthlyIncome[10]}</td><td>${myDashboard.monthlyIncome[11]}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Έξοδα</th> <td>${myDashboard.monthlyExpenses[0]}</td><td>${myDashboard.monthlyExpenses[1]}</td><td>${myDashboard.monthlyExpenses[2]}</td><td>${myDashboard.monthlyExpenses[3]}</td><td>${myDashboard.monthlyExpenses[4]}</td><td>${myDashboard.monthlyExpenses[5]}</td><td>${myDashboard.monthlyExpenses[6]}</td><td>${myDashboard.monthlyExpenses[7]}</td><td>${myDashboard.monthlyExpenses[8]}</td><td>${myDashboard.monthlyExpenses[9]}</td><td>${myDashboard.monthlyExpenses[10]}</td><td>${myDashboard.monthlyExpenses[11]}</td></tr>                
                    </table>
                  </div>
                  <input id="expenses-per-month-and-category" type="button" value="Έξοδα ανα Κατηγορία και Μήνα">
              </div>
    `
    document.querySelector("#expenses-per-month-and-category").addEventListener("click",function(){
      var filter_year=document.querySelector("#DashboardFilter").value;
      fetch_batch_2(filter_year)});
  
    document.querySelector("#employee-analytics").addEventListener("click",function(){
      var associateSelection="";
  
      for(associate of MyAssociates){
        associateSelection+=`<option value=${associate.id}>${associate.firstname} ${associate.surname}</option>`;
      }
      var dashboard_filter=document.querySelector(".job-container");
      dashboard_filter.innerHTML=`
      <div class="dashboard-container">
        <div class="Dashboard-filter-container">
          <div class="Dashboard-filter-wrapper">
            <div class="selection-container">
              <div class="custom-select">
                  <select name="associate">
                  <option value="" selected="selected"> ΕΠΙΛΟΓΗ</option>
                  ${associateSelection}
                  </select>
              </div>
            </div> 
            <input type="number" id="DashboardFilter" name="DashboardFilter" min="2004" max="2060"  value="${default_filter_year}">
            <div class="Dashboard-filter-button-container">
              <img src="images/down_arrow.png" class="DashboardfilterButton"></img>
            </div>
          </div>
        </div>         
      </div>
      `;

      document.querySelector(".DashboardfilterButton").addEventListener("click",function (){
        let selection=document.querySelector(" .Dashboard-filter-container [name='associate']");
        let associate_id=selection.value;
        let associate_name=selection.options[selection.selectedIndex].text;
        let year=document.querySelector("#DashboardFilter").value;
        var Html=document.querySelector(".dashboard-container");
        let loaderHtml=`
          <div class="loader-container">
            <div class="loader">
              <div class="loader-wheel"></div>
              <div class="loader-text"></div>
            </div>
          </div>
        `;
        Html.insertAdjacentHTML("beforeend",loaderHtml);
        getAssociateAnalitics(associate_id,year,associate_name);
      }); 
      //getDashboardData(new Date(new Date().toUTCString()).getFullYear());
    });

    document.querySelector(".DashboardfilterButton").addEventListener("click",function (){
      let year=document.querySelector("#DashboardFilter").value;
      var loaderHtml=document.querySelector(".job-container");
      loaderHtml.innerHTML=`
      <div class="loader-container">
        <div class="loader">
          <div class="loader-wheel"></div>
          <div class="loader-text"></div>
        </div>
      </div>
      `;
      getDashboardData(year);
    });
    make_overview_chart([myDashboard.Baptism_payments+myDashboard.Wedding_payments+myDashboard.Photo_payments,
      myDashboard.Baptism_unpaid+myDashboard.Wedding_unpaid+myDashboard.Photo_unpaid,
      myDashboard.Baptism_expenses+myDashboard.Wedding_expenses+myDashboard.Photo_expenses,
    ]);
    make_jobs_per_category_chart([myDashboard.Wedding_number,myDashboard.Baptism_number,myDashboard.Photo_number]);
    make_income_per_category_chart([myDashboard.Wedding_total_income,myDashboard.Baptism_total_income,myDashboard.Photo_total_income]);
    make_expenses_per_category_chart([myDashboard.Wedding_expenses,myDashboard.Baptism_expenses,myDashboard.Photo_expenses]);
    make_expenses_per_type_chart([myDashboard.Employ_payments_expenses,myDashboard.Editor_payments_expenses,myDashboard.Printer_payments_expenses])
    make_montly_income_expenses_chart(myDashboard.monthlyIncome,myDashboard.monthlyExpenses);

    document.querySelector("#dashboard_table_print").addEventListener('click',function (){
        var table= document.querySelector("#printable-table");
        var today=new Date().toUTCString();
        var formated_date=new Date(today).getDate().toString()+'_'+(new Date(today).getMonth()+1).toString()+'_'+new Date(today).getFullYear().toString();
        var opt = {
          pagebreak: { mode: ['css'] },
          margin:       1,
          filename:     'Isologismos_'+formated_date+'.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'cm', format: 'a4', orientation: 'l' }
        };
        
        html2pdf().set(opt).from(table).save();
    })
  }  

    function makeAssociateDashboard(year,monthlyData,associate_name){
      
      var dashboard=document.querySelector(".job-container");
      var default_filter_year=year;
      var associateSelection="";
  
      for(associate of MyAssociates){
        associateSelection+=`<option value=${associate.id}>${associate.firstname} ${associate.surname}</option>`;
      }
      let TotalMontlyPayment=[sumMontlyPaymets(monthlyData,0),sumMontlyPaymets(monthlyData,1),sumMontlyPaymets(monthlyData,2),sumMontlyPaymets(monthlyData,3),sumMontlyPaymets(monthlyData,4),sumMontlyPaymets(monthlyData,5),sumMontlyPaymets(monthlyData,6),sumMontlyPaymets(monthlyData,7),sumMontlyPaymets(monthlyData,8),sumMontlyPaymets(monthlyData,9),sumMontlyPaymets(monthlyData,10),sumMontlyPaymets(monthlyData,11)];
      let TotalRolePayments=[sumRolePayments(monthlyData.monthlyPhotographer1),sumRolePayments(monthlyData.monthlyPhotographer2),sumRolePayments(monthlyData.monthlyVideographer1),sumRolePayments(monthlyData.monthlyVideographer2),sumRolePayments(monthlyData.monthlyEditor),sumRolePayments(monthlyData.monthlyDrone),sumRolePayments(monthlyData.monthlyAlbums)];
      let allPayments=TotalRolePayments.reduce((a, b) => a + b, 0);
      dashboard.innerHTML=`
      <div class="dashboard-container">
        <div class="Dashboard-filter-container">
          <div class="Dashboard-filter-wrapper">
            <div class="selection-container">
              <div class="custom-select">
                  <select name="associate">
                  <option value="" selected="selected"> ΕΠΙΛΟΓΗ</option>
                  ${associateSelection}
                  </select>
              </div>
            </div> 
            <input type="number" id="DashboardFilter" name="DashboardFilter" min="2004" max="2060"  value="${default_filter_year}">
            <div class="Dashboard-filter-button-container">
              <img src="images/down_arrow.png" class="DashboardfilterButton"></img>
            </div>
          </div>
        </div>    
        <div class="dashboard-section big-table">
            <h2 class="overview">Πληρωμές ${associate_name}</h2>
            <div class="table-container">
              <table class="overview-table">
                  <tr> <td></td> <th>Ιαν</th><th>Φεβ</th><th>Μαρ</th><th>Απρ</th><th>Μάι</th><th>Ιούν</th><th>Ιούλ</th><th>Αυγ</th><th>Σεπ</th><th>Οκτ</th><th>Νοέ</th><th>Δεκ</th></tr>
                  <tr> <th>ΦΩΤΟΓΡΑΦΟΣ 1</th> <td>${monthlyData.monthlyPhotographer1[0]}</td><td>${monthlyData.monthlyPhotographer1[1]}</td><td>${monthlyData.monthlyPhotographer1[2]}</td><td>${monthlyData.monthlyPhotographer1[3]}</td><td>${monthlyData.monthlyPhotographer1[4]}</td><td>${monthlyData.monthlyPhotographer1[5]}</td><td>${monthlyData.monthlyPhotographer1[6]}</td><td>${monthlyData.monthlyPhotographer1[7]}</td><td>${monthlyData.monthlyPhotographer1[8]}</td><td>${monthlyData.monthlyPhotographer1[9]}</td><td>${monthlyData.monthlyPhotographer1[10]}</td><td>${monthlyData.monthlyPhotographer1[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΦΩΤΟΓΡΑΦΟΣ 2</th> <td>${monthlyData.monthlyPhotographer2[0]}</td><td>${monthlyData.monthlyPhotographer2[1]}</td><td>${monthlyData.monthlyPhotographer2[2]}</td><td>${monthlyData.monthlyPhotographer2[3]}</td><td>${monthlyData.monthlyPhotographer2[4]}</td><td>${monthlyData.monthlyPhotographer2[5]}</td><td>${monthlyData.monthlyPhotographer2[6]}</td><td>${monthlyData.monthlyPhotographer2[7]}</td><td>${monthlyData.monthlyPhotographer2[8]}</td><td>${monthlyData.monthlyPhotographer2[9]}</td><td>${monthlyData.monthlyPhotographer2[10]}</td><td>${monthlyData.monthlyPhotographer2[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΒΙΝΤΕΟΓΡΑΦΟΣ 1</th> <td>${monthlyData.monthlyVideographer1[0]}</td><td>${monthlyData.monthlyVideographer1[1]}</td><td>${monthlyData.monthlyVideographer1[2]}</td><td>${monthlyData.monthlyVideographer1[3]}</td><td>${monthlyData.monthlyVideographer1[4]}</td><td>${monthlyData.monthlyVideographer1[5]}</td><td>${monthlyData.monthlyVideographer1[6]}</td><td>${monthlyData.monthlyVideographer1[7]}</td><td>${monthlyData.monthlyVideographer1[8]}</td><td>${monthlyData.monthlyVideographer1[9]}</td><td>${monthlyData.monthlyVideographer1[10]}</td><td>${monthlyData.monthlyVideographer1[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΒΙΝΤΕΟΓΡΑΦΟΣ 2</th> <td>${monthlyData.monthlyVideographer2[0]}</td><td>${monthlyData.monthlyVideographer2[1]}</td><td>${monthlyData.monthlyVideographer2[2]}</td><td>${monthlyData.monthlyVideographer2[3]}</td><td>${monthlyData.monthlyVideographer2[4]}</td><td>${monthlyData.monthlyVideographer2[5]}</td><td>${monthlyData.monthlyVideographer2[6]}</td><td>${monthlyData.monthlyVideographer2[7]}</td><td>${monthlyData.monthlyVideographer2[8]}</td><td>${monthlyData.monthlyVideographer2[9]}</td><td>${monthlyData.monthlyVideographer2[10]}</td><td>${monthlyData.monthlyVideographer2[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΜΟΝΤΑΖ</th> <td>${monthlyData.monthlyEditor[0]}</td><td>${monthlyData.monthlyEditor[1]}</td><td>${monthlyData.monthlyEditor[2]}</td><td>${monthlyData.monthlyEditor[3]}</td><td>${monthlyData.monthlyEditor[4]}</td><td>${monthlyData.monthlyEditor[5]}</td><td>${monthlyData.monthlyEditor[6]}</td><td>${monthlyData.monthlyEditor[7]}</td><td>${monthlyData.monthlyEditor[8]}</td><td>${monthlyData.monthlyEditor[9]}</td><td>${monthlyData.monthlyEditor[10]}</td><td>${monthlyData.monthlyEditor[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>Drone</th> <td>${monthlyData.monthlyDrone[0]}</td><td>${monthlyData.monthlyDrone[1]}</td><td>${monthlyData.monthlyDrone[2]}</td><td>${monthlyData.monthlyDrone[3]}</td><td>${monthlyData.monthlyDrone[4]}</td><td>${monthlyData.monthlyDrone[5]}</td><td>${monthlyData.monthlyDrone[6]}</td><td>${monthlyData.monthlyDrone[7]}</td><td>${monthlyData.monthlyDrone[8]}</td><td>${monthlyData.monthlyDrone[9]}</td><td>${monthlyData.monthlyDrone[10]}</td><td>${monthlyData.monthlyDrone[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΕΚΤΥΠΩΣΕΙΣ</th> <td>${monthlyData.monthlyAlbums[0]}</td><td>${monthlyData.monthlyAlbums[1]}</td><td>${monthlyData.monthlyAlbums[2]}</td><td>${monthlyData.monthlyAlbums[3]}</td><td>${monthlyData.monthlyAlbums[4]}</td><td>${monthlyData.monthlyAlbums[5]}</td><td>${monthlyData.monthlyAlbums[6]}</td><td>${monthlyData.monthlyAlbums[7]}</td><td>${monthlyData.monthlyAlbums[8]}</td><td>${monthlyData.monthlyAlbums[9]}</td><td>${monthlyData.monthlyAlbums[10]}</td><td>${monthlyData.monthlyAlbums[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΣΥΝΟΛΙΚΑ</th> <td>${TotalMontlyPayment[0]}</td><td>${TotalMontlyPayment[1]}</td><td>${TotalMontlyPayment[2]}</td><td>${TotalMontlyPayment[3]}</td><td>${TotalMontlyPayment[4]}</td><td>${TotalMontlyPayment[5]}</td><td>${TotalMontlyPayment[6]}</td><td>${TotalMontlyPayment[7]}</td><td>${TotalMontlyPayment[8]}</td><td>${TotalMontlyPayment[9]}</td><td>${TotalMontlyPayment[10]}</td><td>${TotalMontlyPayment[11]}</td></tr>
                </table>

            </div>
            <div class="table-container">
              <table class="associate-role-payments-table">
                  <tr> <td>Ετήσια Ανα Κατηγορία</td> <th>ΣΥΝΟΛΙΚΑ</th></tr>
                  <tr> <th>ΦΩΤΟΓΡΑΦΟΣ 1</th> <td>${TotalRolePayments[0]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΦΩΤΟΓΡΑΦΟΣ 2</th> <td>${TotalRolePayments[1]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΒΙΝΤΕΟΓΡΑΦΟΣ 1</th> <td>${TotalRolePayments[2]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΒΙΝΤΕΟΓΡΑΦΟΣ 2</th> <td>${TotalRolePayments[3]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΜΟΝΤΑΖ</th> <td>${TotalRolePayments[4]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>Drone</th> <td>${TotalRolePayments[5]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΕΚΤΥΠΩΣΕΙΣ</th> <td>${TotalRolePayments[6]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΣΥΝΟΛΙΚΕΣ ΠΛΗΡΩΜΕΣ ΣΥΝΕΡΓΑΤΗ</th> <td>${allPayments}</td></tr>
                </table>
            </div>
        </div>   
      </div>
      `
  
      document.querySelector(".DashboardfilterButton").addEventListener("click",function (){
          let selection=document.querySelector(" .Dashboard-filter-container [name='associate']");
          let associate_id=selection.value;
          let associate_name=selection.options[selection.selectedIndex].text;
          let year=document.querySelector("#DashboardFilter").value;
          var loaderHtml=document.querySelector(".job-container");
          loaderHtml.innerHTML=`
          <div class="loader-container">
            <div class="loader">
              <div class="loader-wheel"></div>
              <div class="loader-text"></div>
            </div>
          </div>
          `;
          getAssociateAnalitics(associate_id,year,associate_name);
        });
      }

  function makeMonthlyExpensesDashboardTable(year){
    let button=document.querySelector("#expenses-per-month-and-category");
    button.remove();
    let anHTML=`<h2 class="overview"> Έξοδα ανα Κατηγορία και Μήνα</h2>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <td></td> <th>Ιαν</th><th>Φεβ</th><th>Μαρ</th><th>Απρ</th><th>Μάι</th><th>Ιούν</th><th>Ιούλ</th><th>Αυγ</th><th>Σεπ</th><th>Οκτ</th><th>Νοέ</th><th>Δεκ</th></tr>
                       <tr> <th>Mεροκάματα</th> <td>${myDashboard.monthlyPaymentsExpenses[0]}</td><td>${myDashboard.monthlyPaymentsExpenses[1]}</td><td>${myDashboard.monthlyPaymentsExpenses[2]}</td><td>${myDashboard.monthlyPaymentsExpenses[3]}</td><td>${myDashboard.monthlyPaymentsExpenses[4]}</td><td>${myDashboard.monthlyPaymentsExpenses[5]}</td><td>${myDashboard.monthlyPaymentsExpenses[6]}</td><td>${myDashboard.monthlyPaymentsExpenses[7]}</td><td>${myDashboard.monthlyPaymentsExpenses[8]}</td><td>${myDashboard.monthlyPaymentsExpenses[9]}</td><td>${myDashboard.monthlyPaymentsExpenses[10]}</td><td>${myDashboard.monthlyPaymentsExpenses[11]}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Μοντάζ</th> <td>${myDashboard.monthlyEditorExpenses[0]}</td><td>${myDashboard.monthlyEditorExpenses[1]}</td><td>${myDashboard.monthlyEditorExpenses[2]}</td><td>${myDashboard.monthlyEditorExpenses[3]}</td><td>${myDashboard.monthlyEditorExpenses[4]}</td><td>${myDashboard.monthlyEditorExpenses[5]}</td><td>${myDashboard.monthlyEditorExpenses[6]}</td><td>${myDashboard.monthlyEditorExpenses[7]}</td><td>${myDashboard.monthlyEditorExpenses[8]}</td><td>${myDashboard.monthlyEditorExpenses[9]}</td><td>${myDashboard.monthlyEditorExpenses[10]}</td><td>${myDashboard.monthlyEditorExpenses[11]}</td></tr>                
                       <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Εκτυπώσεις</th> <td>${myDashboard.monthlyPrinterExpenses[0]}</td><td>${myDashboard.monthlyPrinterExpenses[1]}</td><td>${myDashboard.monthlyPrinterExpenses[2]}</td><td>${myDashboard.monthlyPrinterExpenses[3]}</td><td>${myDashboard.monthlyPrinterExpenses[4]}</td><td>${myDashboard.monthlyPrinterExpenses[5]}</td><td>${myDashboard.monthlyPrinterExpenses[6]}</td><td>${myDashboard.monthlyPrinterExpenses[7]}</td><td>${myDashboard.monthlyPrinterExpenses[8]}</td><td>${myDashboard.monthlyPrinterExpenses[9]}</td><td>${myDashboard.monthlyPrinterExpenses[10]}</td><td>${myDashboard.monthlyPrinterExpenses[11]}</td></tr>                                   
                    </table>  
                  </div>`;
    let section=document.querySelector("#income-expenses-per-month");
    section.insertAdjacentHTML("beforeend",anHTML);
  }
/////////////////////////////////////////////////////////////////////////////////////
function addOffer() {
  let bodyData = getOfferFormData();
  fetch("/api/offers", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      getOfferCards();
      alert(json);
      modal.innerHTML="";
      modal.style.display="none";
    })
    .catch((err) => alert("error:", err));
}

function updateOffer(id) {
  let bodyData = getOfferFormData();
  fetch("/api/offers/" + id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getOfferCards();
    })
    .catch((err) => alert("error:", err));
}

function getOfferCards() {
  dates=getDateFilter();
  fetch("/api/offers/filtered/"+dates, { method: "GET" })
    .then((res) => res.json())
    .then((json) => make_offer_cards(json))
    .catch((err) => console.error("error:", err));
}

function getOfferDetails(id) {
  console.log(id);
  fetch("/api/offers/details/"+id, { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      showOfferDetails(json[0]);
      })
    .catch((err) => console.error("error:", err));
}

function getJobCards() {
  var dates=getDateFilter();
  fetch("/api/jobs/filtered/"+dates, { method: "GET" })
    .then((res) => res.json())
    .then((json) => make_job_cards(json))
    .catch((err) => console.error("error:", err));
}
function getJobStatus() {
  var dates=getDateFilter();
  fetch("/api/jobs/filtered/status/"+dates, { method: "GET" })
    .then((res) => res.json())
    .then((json) => make_job_status_table(json))
    .catch((err) => console.error("error:", err));
}

function getJobDetails(id) {
  fetch("/api/jobs/details/"+id, { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      showJobDetails(json[0]);
      })
    .catch((err) => console.error("error:", err));
}

function addJob(id) {
  let bodyData = getOfferFormData();
  fetch("/api/jobs/"+id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getJobCards();
      modal.innerHTML="";
      modal.style.display="none";

    })
    .catch((err) => alert("error:", err));
}

function createJob() {
  let bodyData = getOfferFormData();
  fetch("/api/createJob", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getJobCards();
      modal.innerHTML="";
      modal.style.display="none";

    })
    .catch((err) => alert("error:", err));
}

function updateJob(id) {
  let bodyData = getJobFormData();
  fetch("/api/jobs/" + id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getJobStatus();
    })
    .catch((err) => alert("error:", err));
}

//////////send job to google calendar //////4

function addCalendarEvent() {
  let bodyData = getJobEventData();
  fetch("/api/job/createEvent", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
    })
    .catch((err) => alert("error:", err));
}


function getAssociates(x) {
  fetch("/api/settings/associates", { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
      save_associates_table(json);
      if(x=="maketable"){make_associates_table(MyAssociates);}})
    .catch((err) => console.error("error:", err));
}

function save_associates_table(Associates){
  MyAssociates=JSON.parse(JSON.stringify(Associates));
}

function addAssociate() {
  let bodyData = getAssociateFormData("add");
  fetch("/api/settings/associates", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getAssociates("maketable");
    })
    .catch((err) => alert("error:", err));
}

function updateAssociate() {
  let bodyData = getAssociateFormData("update");
  fetch("/api/settings/associates/" + bodyData.id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getAssociates("maketable");
    })
    .catch((err) => alert("error:", err));
}


function getProducts(x) {
  fetch("/api/settings/products", { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
      save_products_table(json);
      if(x=="maketable"){make_products_table(MyProducts);}})
    .catch((err) => console.error("error:", err));
}

function save_products_table(Products){
  MyProducts=JSON.parse(JSON.stringify(Products));
}

function addProduct() {
  let bodyData = getProductFormData();
  fetch("/api/settings/products", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getProducts("maketable");
    })
    .catch((err) => alert("error:", err));
}

function updateProduct() {
  let bodyData = getProductFormData();
  fetch("/api/settings/products/" + bodyData.id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getProducts("maketable");
    })
    .catch((err) => alert("error:", err));
}



function archiveOffer(id) {
  let bodyData = getOfferFormData();
  fetch("/api/archive/offers/"+id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getOfferCards();
      modal.innerHTML="";
      modal.style.display="none";

    })
    .catch((err) => alert("error:", err));
}


function getArchivedOffers() {
  let dates=getDateFilter();
  fetch("/api/archive/offers/filtered/"+dates, { method: "GET" })
    .then((res) => res.json())
    .then((json) => make_Offer_Archive_Table(json))
    .catch((err) => console.error("error:", err));
}

function getArchivedOfferDetails(id) {
  console.log(id);
  fetch("/api/archive/offers/details/"+id, { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      showArchivedOfferDetails(json[0]);
      })
    .catch((err) => console.error("error:", err));
}


function archiveJob(id) {
  let bodyData = getJobFormData();
  fetch("/api/archive/jobs/"+id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getJobCards();
      modal.innerHTML="";
      modal.style.display="none";

    })
    .catch((err) => alert("error:", err));
}

function getArchivedJobs() {
  let dates=getDateFilter();
  fetch("/api/archive/jobs/filtered/"+dates, { method: "GET" })
    .then((res) => res.json())
    .then((json) => make_Job_Archive_Table(json))
    .catch((err) => console.error("error:", err));
}

function getArchivedJobDetails(id) {
  fetch("/api/archive/jobs/details/"+id, { method: "GET" })
    .then((res) => res.json())
    .then((json) => {showArchivedJobDetails(json[0]);})
    .catch((err) => console.error("error:", err));
}

function RestoreArchivedOffer(id) {
  fetch("/api/archive/offers/restore/"+id, { 
    headers: {
     Accept: "application/json", "Content-Type": "application/json"},
    method: "DELETE" })
    .then((res) => res.json())
    .then((json) => {getArchivedOffers();})
    .catch((err) => console.error("error:", err));
}

function RestoreArchivedJob(id) {
  fetch("/api/archive/jobs/restore/"+id, { 
    headers: {
     Accept: "application/json", "Content-Type": "application/json"},
    method: "DELETE" })
    .then((res) => res.json())
    .then(() => {getArchivedJobs();})
    .catch((err) => console.error("error:", err));
}

function DeleteArchivedOffer(id) {
  fetch("/api/archive/offers/delete/"+id, { 
    headers: {
     Accept: "application/json", "Content-Type": "application/json"},
    method: "DELETE" })
    .then((res) => res.json())
    .then((json) => {getArchivedOffers();})
    .catch((err) => console.error("error:", err));
}

function DeleteArchivedJob(id) {
  fetch("/api/archive/jobs/delete/"+id, { 
    headers: {
     Accept: "application/json", "Content-Type": "application/json"},
    method: "DELETE" })
    .then((res) => res.json())
    .then((json) => {getArchivedJobs();})
    .catch((err) => console.error("error:", err));
}


/////// get schedule/////
function getJobSchedule(){
  let dates=getDateFilter();
  fetch("/api/jobs/filtered/schedule/"+dates, { method: "GET" })
    .then((res) => res.json())
    .then((json) => make_schedule_table(json))
    .catch((err) => console.error("error:", err));
}

function make_schedule_table(Jobs){

  var schedule_table=[];

  for (var i = 0; i < 32; i++) {
    schedule_table.push([]);
  }
  console.log(schedule_table);
  let photographer1;
  let photographer2;
  let videographer1;
  let videographer2;
  let drone;

  for(job of Jobs){
    var utcdate= new Date(job.date).toUTCString();
    var day=new Date(utcdate).getDate();
    
    //returns an array of objects based on the comparisson operation and [0] returns the first one
    // anonymous function with => is used in order to pass the job.attribude parammeter inside the function
    photographer1=MyAssociates.filter(person => person.id==job.photographer1)[0];
    photographer2=MyAssociates.filter(person => person.id==job.photographer2)[0];
    videographer1=MyAssociates.filter(person => person.id==job.videographer1)[0];
    videographer2=MyAssociates.filter(person => person.id==job.videographer2)[0];
    drone=MyAssociates.filter(person => person.id==job.drone)[0];

    if(photographer1!=null){
      schedule_table[day].push(photographer1.firstname +" "+ photographer1.surname);
    }
    if(photographer2!=null){
      schedule_table[day].push(photographer2.firstname +" "+ photographer2.surname);

    }
    if(videographer1!=null){
      schedule_table[day].push(videographer1.firstname +" "+ videographer1.surname);

    }
    if(videographer2!=null){
      schedule_table[day].push(videographer2.firstname +" "+ videographer2.surname);

    }
    if(drone!=null){
      schedule_table[day].push(drone.firstname +" "+ drone.surname); 

    }
  }
  console.log(schedule_table[4]);

  for(let j=1;j<32;j++){
    uniqueArray = schedule_table[j].filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
  });
  schedule_table[j]=uniqueArray;
  }

  console.log(schedule_table);
  filterdate=getDateFilter().split(',');
  firstdaydate=new Date(filterdate[0],parseInt(filterdate[1])-1,1);
  firstday=new Date(firstdaydate).getDay();

  content=document.querySelector(".modal-content #SettingsTabContent");
  let anHTML=`<h2>Πίνακας Μηνιαίου Προγράμματος</h2>   
    <input id="download_schedule_pdf" type="button" value="Λήψη PDF">

    <div class="ScheduleTableContainer">
    <div class="dayname">ΔΕΥΤΕΡΑ</div>
    <div class="dayname">ΤΡΙΤΗ</div>
    <div class="dayname">ΤΕΤΑΡΤΗ</div>
    <div class="dayname">ΠΕΜΠΤΗ</div>
    <div class="dayname">ΠΑΡΑΣΚΕΥΗ</div>
    <div class="dayname">ΣΑΒΒΑΤΟ</div>
    <div class="dayname">ΚΥΡΙΑΚΗ</div>`;

   if(firstday===0){
    for(let i=1;i<7;i++){
      anHTML+=`
      <div class="day">
          <div class="number"></div>
          <div class="name"></div>
      </div>`
    }
   }
   else{
    for(let i=1;i<firstday;i++){
      anHTML+=`
      <div class="day">
          <div class="number"></div>
          <div class="name"></div>
      </div>`
    }
   }
  
    for (let j=1;j<32;j++){
      anHTML+=`<div class="day">
          <div class="number">${j}</div>`;
      for (let i=0;i<schedule_table[j].length;i++){
        
        if(schedule_table[j][i]){
          anHTML+=`<div class="entry-wrapper"><div class="name">${schedule_table[j][i]}</div> <input type="text"></div>`
        }
        else{
          anHTML+=`<div class="name"></div>`

        }
      }
      anHTML+="</div>";
    }
  anHTML+="</div>";
  content.innerHTML=anHTML;

  document.querySelector("#download_schedule_pdf").addEventListener("click", function () {
    
    var table= document.querySelector(".ScheduleTableContainer");
    dates=getDateFilter().replace(',','-');
    var opt = {
      pagebreak: { mode: ['css'], avoid:[".number",".name",".entry-wrapper"] },
      margin:       1,
      filename:     'Schedule_'+dates+".pdf",
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'cm', format: 'a3', orientation: 'l' }
    };
    
    html2pdf().set(opt).from(table).save();
  });

}

function getPaymentFormData() {
  let payment = {
    amount: document.querySelector("#payment_form [name='payment_amount']").value,
  };
  return JSON.stringify(payment);
}

function getPayments(id,condition,offer_price){
  fetch("/api/payments/"+id, { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
      if(condition=="archive"){
        show_payments_archived(json,offer_price);
      }
      else{
        show_payments(json,id,offer_price);}
      return json;
      }) 
    .then((json)=>{if(condition!="archive"){calculate_owed(offer_price,json);}})
    .catch((err) => console.error("error:", err));
}

function calculate_owed(offer_price,Payments){
  let sum=0;
  for(let payment of Payments){
    sum+=payment.amount;
  }
  let owed_ammount=offer_price-sum;
  //console.log(owed_ammount);
  document.querySelector("#payments_owed_amount").innerHTML="Υπόλοιπο: "+owed_ammount;
}

function addPayment(job_id){
  let bodyData = getPaymentFormData();
  let offer_price=document.querySelector("#price").value;
  fetch("/api/payments/"+job_id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then(() => {
      getPayments(job_id,"",offer_price);
    })
    .catch((err) => alert("error:", err));
}

function deletePayment(payment_id,job_id) {
  let offer_price=document.querySelector("#price").value;
  fetch("/api/payments/delete/"+payment_id, { 
    headers: {
     Accept: "application/json", "Content-Type": "application/json"},
    method: "DELETE" })
    .then((res) => res.json())
    .then((json) => {getPayments(job_id,"",offer_price);})
    .catch((err) => console.error("error:", err));
}

function show_payments(Payments,job_id,offer_price){
  let payments_window=document.querySelector("#OfferPackageModal");
  
  
  var anHTML=`<div class="modal-content">
  <span class="close close2">&times;</span>
  <h3>ΠΛΗΡΩΜΕΣ</h3>
  <h4>Τιμή: ${offer_price}</h4>
  <h4 id="payments_owed_amount"></h4>
  <form id="payment_form">
    <label for="payment_id">Κωδικός</label>
    <input type="number" step="1" min="0" max="10000" id="payment_id" name="payment_id" placeholder="Κωδικός..." >
    <label for="payment_amount">Ποσό</label>
    <input type="number" step="1" min="0" max="10000" id="payment_amount" name="payment_amount" placeholder="Ποσό..." >
   </form> 

   <input id="new_payment" type="button" value="Προσθήκη">
   <input id="delete_payment" type="button" value="Διαγραφή">
   <table id="payments_Table"><tr><th>Κωδικός</th><th>Ποσό</th><th>Ημ/νία Συναλλαγής</th></tr> 
  `;

  for (let payment of Payments) {
    var payment_date=payment.date.split('.')[0].split('T');
    var date=payment_date[0].split('-');
    var formated_date= date[2]+'-'+date[1]+'-'+date[0];
    anHTML += `<tr>
          <td>${payment.id}</td>
          <td>${payment.amount}</td>
          <td>${payment_date[1]} ${formated_date}</td>
          </tr>`;
  }
  anHTML += "</table></div>";
  payments_window.innerHTML=anHTML;
  payments_window.style.display = "block";
  var span = document.getElementsByClassName("close2")[0];
  span.onclick = function () {
    payments_window.innerHTML = "";
    payments_window.style.display = "none";
  };

  document.querySelector("#new_payment").addEventListener("click", a =>
    addPayment(job_id)
  );
  

  document.querySelector("#delete_payment").addEventListener("click",a => {
    var id=document.querySelector("#payment_form #payment_id").value;
    deletePayment(id,job_id);
  });

  document.querySelector("#payments_Table").addEventListener("click", selectPayment);

}

function show_payments_archived(Payments,offer_price){
  let payments_window=document.querySelector("#OfferPackageModal");
  
  
  var anHTML=`<div class="modal-content">
  <span class="close close2">&times;</span>
  <h3>ΠΛΗΡΩΜΕΣ</h3>
  <h4>Τιμή: ${offer_price}</h4>
   <table id="payments_Table"><tr><th>Κωδικός</th><th>Ποσό</th><th>Ημ/νία Συναλλαγής</th></tr> 
  `;

  for (let payment of Payments) {
    anHTML += `<tr>
          <td>${payment.id}</td>
          <td>${payment.amount}</td>
          <td>${payment.date}</td>
          </tr>`;
  }
  anHTML += "</table></div>";
  payments_window.innerHTML=anHTML;
  payments_window.style.display = "block";
  var span = document.getElementsByClassName("close2")[0];
  span.onclick = function () {
    payments_window.innerHTML = "";
    payments_window.style.display = "none";
  };
}

function selectPayment(event) {
  if (!event.target.outerHTML.startsWith("<td>")) return;
  let aRow = event.target.parentNode;
  let inputs = document.querySelectorAll("#payment_form input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = aRow.children[i].innerText;
  }
  let rows = [...aRow.parentNode.children];
  rows.forEach((r) => r.classList.remove("selected"));
  aRow.classList.add("selected");
}

function getDashboardData(filter_year){
  const year=filter_year;
  Promise.all([

    fetch("/api/dashboard/jobCount/"+"baptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/jobCount/"+"gamos,"+year, { method: "GET" }),
    fetch("/api/dashboard/jobCount/"+"fotografisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/IncomePerCategory/"+"baptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/IncomePerCategory/"+"gamos,"+year, { method: "GET" }),
    fetch("/api/dashboard/IncomePerCategory/"+"fotografisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/PaymentsPerCategory/"+"baptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/PaymentsPerCategory/"+"gamos,"+year, { method: "GET" }),
    fetch("/api/dashboard/PaymentsPerCategory/"+"fotografisi,"+year, { method: "GET" }),

    fetch("/api/dashboard/ExpensesPerCategory/"+"baptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerCategory/"+"gamos,"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerCategory/"+"fotografisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerType/EmployPayments/"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerType/EditorPayments/"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerType/PrinterPayments/"+year, { method: "GET" }),

    fetch("/api/dashboard/monthlyIncome/"+"1,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"2,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"3,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"4,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"5,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"6,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"7,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"8,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"9,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"10,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"11,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"12,"+year, { method: "GET" }),

    fetch("/api/dashboard/monthlyExpenses/"+"1,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"2,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"3,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"4,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"5,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"6,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"7,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"8,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"9,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"10,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"11,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"12,"+year, { method: "GET" }),
])
.then(response => Promise.all(response.map(r => r.json())))
.then(response => {
  
  // 2 indexes because response is now an array of arrays containing json data
  myDashboard.Baptism_number=response[0][0].job_count;
  myDashboard.Wedding_number=response[1][0].job_count;
  myDashboard.Photo_number=response[2][0].job_count;
  myDashboard.Baptism_total_income=response[3][0].incomeTotal;
  myDashboard.Wedding_total_income=response[4][0].incomeTotal;
  myDashboard.Photo_total_income=response[5][0].incomeTotal;
  myDashboard.Baptism_payments=response[6][0].paymentTotal;
  myDashboard.Wedding_payments=response[7][0].paymentTotal;
  myDashboard.Photo_payments=response[8][0].paymentTotal;

  myDashboard.Baptism_unpaid=myDashboard.Baptism_total_income-myDashboard.Baptism_payments;
  myDashboard.Wedding_unpaid=myDashboard.Wedding_total_income-myDashboard.Wedding_payments;
  myDashboard.Photo_unpaid=myDashboard.Photo_total_income-myDashboard.Photo_payments;

  myDashboard.Baptism_expenses=response[9][0].Expenses;
  myDashboard.Wedding_expenses=response[10][0].Expenses;
  myDashboard.Photo_expenses=response[11][0].Expenses;
  myDashboard.Employ_payments_expenses=response[12][0].Expenses;
  myDashboard.Editor_payments_expenses=response[13][0].Expenses;
  myDashboard.Printer_payments_expenses=response[14][0].Expenses;

  myDashboard.monthlyIncome[0]=response[15][0].MonthlyIncome;
  myDashboard.monthlyIncome[1]=response[16][0].MonthlyIncome;
  myDashboard.monthlyIncome[2]=response[17][0].MonthlyIncome;
  myDashboard.monthlyIncome[3]=response[18][0].MonthlyIncome;
  myDashboard.monthlyIncome[4]=response[19][0].MonthlyIncome;
  myDashboard.monthlyIncome[5]=response[20][0].MonthlyIncome;
  myDashboard.monthlyIncome[6]=response[21][0].MonthlyIncome;
  myDashboard.monthlyIncome[7]=response[22][0].MonthlyIncome;
  myDashboard.monthlyIncome[8]=response[23][0].MonthlyIncome;
  myDashboard.monthlyIncome[9]=response[24][0].MonthlyIncome;
  myDashboard.monthlyIncome[10]=response[25][0].MonthlyIncome;
  myDashboard.monthlyIncome[11]=response[26][0].MonthlyIncome;
  
  myDashboard.monthlyExpenses[0]=response[27][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[1]=response[28][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[2]=response[29][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[3]=response[30][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[4]=response[31][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[5]=response[32][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[6]=response[33][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[7]=response[34][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[8]=response[35][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[9]=response[36][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[10]=response[37][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[11]=response[38][0].MonthlyExpenses;


  console.log(myDashboard);
})
  .then(()=>{makeDashboard(year)})
}

function fetch_batch_2(year){
    Promise.all([

    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"1,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"2,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"3,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"4,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"5,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"6,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"7,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"8,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"9,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"10,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"11,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"12,"+year, { method: "GET" }),

      fetch("/api/dashboard/monthlyEditorExpenses/"+"1,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"2,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"3,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"4,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"5,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"6,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"7,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"8,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"9,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"10,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"11,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"12,"+year, { method: "GET" }),

      fetch("/api/dashboard/monthlyPrinterExpenses/"+"1,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"2,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"3,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"4,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"5,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"6,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"7,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"8,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"9,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"10,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"11,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"12,"+year, { method: "GET" }), 
    ])
.then(response => Promise.all(response.map(r => r.json())))
.then(response => {
  
  myDashboard.monthlyPaymentsExpenses[0]=response[0][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[1]=response[1][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[2]=response[2][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[3]=response[3][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[4]=response[4][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[5]=response[5][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[6]=response[6][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[7]=response[7][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[8]=response[8][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[9]=response[9][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[10]=response[10][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[11]=response[11][0].monthlyPaymentsExpenses;

  myDashboard.monthlyEditorExpenses[0]=response[12][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[1]=response[13][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[2]=response[14][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[3]=response[15][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[4]=response[16][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[5]=response[17][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[6]=response[18][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[7]=response[19][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[8]=response[20][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[9]=response[21][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[10]=response[22][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[11]=response[23][0].monthlyEditorExpenses;

  myDashboard.monthlyPrinterExpenses[0]=response[24][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[1]=response[25][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[2]=response[26][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[3]=response[27][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[4]=response[28][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[5]=response[29][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[6]=response[30][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[7]=response[31][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[8]=response[32][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[9]=response[33][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[10]=response[34][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[11]=response[35][0].monthlyPrinterExpenses;
  console.log(myDashboard);
  })
  .then(()=>{makeMonthlyExpensesDashboardTable(year)})
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


function make_schedule(Jobs,Offers){

  var schedule_table=[];

  for (var i = 0; i < 32; i++) {
    schedule_table.push([]);
  }
  console.log(schedule_table);

  for(job of Jobs){
    var utcdate= new Date(job.date).toUTCString();
    var day=new Date(utcdate).getDate();  
    
    if(job.job_type==="gamos"){
      schedule_table[day].push("ΓΑΜΟΣ-"+ job.job_name); 
    }
    else if(job.job_type==="baptisi"){
      schedule_table[day].push("ΒΑΠΤΙΣΗ-"+ job.job_name); 
    }
    else {
      schedule_table[day].push("ΦΩΤΟΓΡΑΦΙΣΗ-"+ job.job_name); 
    }
    
  }

  for(offer of Offers){
    var utcdate= new Date(offer.date).toUTCString();
    var day=new Date(utcdate).getDate();  
    
    schedule_table[day].push( "ΠΡΟΣΦΟΡΑ-"+ offer.offer_name); 
  }
  
  console.log(schedule_table);
  filterdate=getDateFilter().split(',');
  firstdaydate=new Date(filterdate[0],parseInt(filterdate[1])-1,1);
  firstday=new Date(firstdaydate).getDay();
  
  document.querySelector("#PageTag").textContent = "ΔΙΑΘΕΣΙΜΟΤΗΤΑ";
  content=document.querySelector(".job-container");
  let anHTML=` 
    

    <div class="AvailabilityScheduleContainer">
    <div class="dayname">ΔΕΥΤΕΡΑ</div>
    <div class="dayname">ΤΡΙΤΗ</div>
    <div class="dayname">ΤΕΤΑΡΤΗ</div>
    <div class="dayname">ΠΕΜΠΤΗ</div>
    <div class="dayname">ΠΑΡΑΣΚΕΥΗ</div>
    <div class="dayname">ΣΑΒΒΑΤΟ</div>
    <div class="dayname">ΚΥΡΙΑΚΗ</div>`;

   if(firstday===0){
    for(let i=1;i<7;i++){
      anHTML+=`
      <div class="day">
          <div class="number"></div>
          <div class="name"></div>
      </div>`
    }
   }
   else{
    for(let i=1;i<firstday;i++){
      anHTML+=`
      <div class="day">
          <div class="number"></div>
          <div class="name"></div>
      </div>`
    }
   }
  
    for (let j=1;j<32;j++){
      anHTML+=`<div class="day">
          <div class="number">${j}</div>`;
      for (let i=0;i<schedule_table[j].length;i++){
        
        if(schedule_table[j][i]){
          anHTML+=`<div class="name">${schedule_table[j][i]}</div>`
        }
        else{
          anHTML+=`<div class="name"></div>`

        } 
      }
      anHTML+="</div>";
    }
  anHTML+="</div>";
  content.innerHTML=anHTML;


}

document.querySelector("#availability").addEventListener('click', function(){
  document.querySelector("#bt-menu a.bt-menu-trigger").click(); //closemenu
  var element=document.querySelector(".date_filter #typeFilter");
  if(element){
    element.remove();
  }
  show_hide_date_filter(1);
  getAvailability();
});

function getAvailability(){
  
  dates=getDateFilter();
  month=dates.split(',')[1];
  if(month!=='0'){
    Promise.all([
      fetch("/api/jobs/filtered/"+dates, { method: "GET" }),
      fetch("/api/offers/filtered/"+dates, { method: "GET" })
  ])
  .then(response => Promise.all(response.map(r => r.json())))
  .then(response => {
    make_schedule(response[0],response[1]);
  })
  }
  
}

function show_pdf(type,id,pdf){
  pdf_window=document.querySelector("#OfferPackageModal");
  // hide the timestamp prefix added on upload (older files have none)
  var pdf_display_name=pdf ? pdf.replace(/^\d{13}-/, "") : pdf;
  

  
  if(!pdf){
    if(type==="archived_offer" || type==="archived_job"){
      var anHTML=`<div class="modal-content">
      <span class="close close2">&times;</span>
      <h2> ΔΕΝ ΥΠΑΡΧΕΙ ΣΥΣΧΕΤΙΣΜΕΝΟ PDF ΜΕ ΤΗ ΣΥΓΚΕΚΡΙΜΕΝΗ ΠΡΟΣΦΟΡΑ</h2>
      </div>
      `;

      pdf_window.innerHTML=anHTML;
    }
    else{
      var anHTML=`<div class="modal-content">
      <span class="close close2">&times;</span>
      <h2> ΔΕΝ ΥΠΑΡΧΕΙ ΣΥΣΧΕΤΙΣΜΕΝΟ PDF ΜΕ ΤΗ ΣΥΓΚΕΚΡΙΜΕΝΗ ΠΡΟΣΦΟΡΑ</h2>
      <input type="file" id="select_pdf" name="pdf" accept="image/*,.pdf" single>
      <input id="upload_pdf" type="button" value="ΑΝΕΒΑΣΕ PDF">
      </div>
      `;

      pdf_window.innerHTML=anHTML;

      document.querySelector("#upload_pdf").addEventListener("click", function (){
        upload_pdf(type,id); 
      });
    }
  
  }
  else{
    var pdf_url='/api/download-pdf/'+encodeURIComponent(pdf);
    // preview on desktop; touch devices get a new tab button instead (CSS shows one or the other)
    var preview_html=`
      <input id="open_pdf_tab" class="pdf_open_tab" type="button" value="ΑΝΟΙΓΜΑ ΣΕ ΝΕΑ ΚΑΡΤΕΛΑ">
      <iframe class="pdf_preview" src="${pdf_url}?inline=1" title="${pdf_display_name}"></iframe>`;

    if(type==="archived_offer" || type==="archived_job"){
      var anHTML=`<div class="modal-content">
      <span class="close close2">&times;</span>
      <h2> ΒΡΕΘΗΚΕ ΣΥΣΧΕΤΙΣΜΕΝΟ PDF</h2>
      <h3>${pdf_display_name}</h3>
      <input id="download_pdf" type="button" value="ΚΑΤΕΒΑΣΜΑ PDF">
      <a id="pdf_link" href="${pdf_url}"></a>
      ${preview_html}
      </div>
      `;

      pdf_window.innerHTML=anHTML;

      document.querySelector("#download_pdf").addEventListener("click", function (){
        let link=document.querySelector("#pdf_link");
        link.click();
      });
    }
    else{
      var anHTML=`<div class="modal-content">
      <span class="close close2">&times;</span>
      <h2> ΒΡΕΘΗΚΕ ΣΥΣΧΕΤΙΣΜΕΝΟ PDF</h2>
      <h3>${pdf_display_name}</h3>
      <input type="file" id="select_pdf" name="pdf" accept="image/*,.pdf" single>
      <input id="upload_pdf" type="button" value="ΑΝΤΙΚΑΤΑΣΤΑΣΗ">
      <input id="download_pdf" type="button" value="ΚΑΤΕΒΑΣΜΑ PDF">
      <a id="pdf_link" href="${pdf_url}"></a>
      ${preview_html}
      </div>
      `;

      pdf_window.innerHTML=anHTML;

      document.querySelector("#upload_pdf").addEventListener("click", function (){
        upload_pdf(type,id); 
      });

      document.querySelector("#download_pdf").addEventListener("click", function (){
        let link=document.querySelector("#pdf_link");
        link.click();
      });
    }

    document.querySelector("#open_pdf_tab").addEventListener("click", function (){
      window.open(pdf_url+"?inline=1", "_blank");
    });
  }


  pdf_window.style.display = "block";
  var span = document.getElementsByClassName("close2")[0];
  span.onclick = function () {
    pdf_window.innerHTML = "";
    pdf_window.style.display = "none";
  };
 
}


function upload_pdf(type,id) {
  const files = document.getElementById("select_pdf");
  const formData = new FormData();
  let file_name=files.files[0].name;
  console.log(file_name);
  formData.append("file", files.files[0]);

  fetch("/api/upload-pdf", {
    method: 'POST',
    body: formData
  })
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then((saved_name)=> associate_pdf(type,id,saved_name)) // server adds a timestamp prefix to the name
    .catch((err) => alert("Error occured", err));

}

function associate_pdf(mytype,myid,myfile_name){
  let data={
    type:mytype,
    id:myid,
    file_name:myfile_name
  }
  
  let bodyData=JSON.stringify(data);

  fetch("/api/associate-pdf", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: bodyData,
  })
  .then((res) => res.json())
  .then((json)=>{
    if(confirm(json)){
      window.location.reload();
    }
    else{
      window.location.reload();
    }
  })
  .catch((err) => alert("Error occured", err));

}


function getAssociateAnalitics(id,filter_year,name){
  const year=filter_year;
  var array={};
  const associate_name=name;
  Promise.all([
    fetch("/api/associateAnalytics/monthlyPayments/"+"1,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"2,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"3,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"4,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"5,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"6,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"7,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"8,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"9,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"10,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"11,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"12,"+year+","+id, { method: "GET" })
])
.then(response => Promise.all(response.map(r => r.json())))
.then(response => {
  console.log(response);
  let albums=[];
  let drone=[];
  let editor=[];
  let photographer1=[];
  let photographer2=[];
  let videographer1=[];
  let videographer2=[];
  for(let i=0;i<12;i++){
    albums[i]=response[i][0].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    drone[i]=response[i][1].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    editor[i]=response[i][2].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    photographer1[i]=response[i][3].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    photographer2[i]=response[i][4].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    videographer1[i]=response[i][5].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    videographer2[i]=response[i][6].AssociateMonthlyExpenses;
  }

  array={
    monthlyAlbums:albums,
    monthlyDrone:drone,
    monthlyEditor:editor,
    monthlyPhotographer1:photographer1,
    monthlyPhotographer2:photographer2,
    monthlyVideographer1:videographer1,
    monthlyVideographer2:videographer2,        
  }
  console.log(array);
})
.then(()=>{makeAssociateDashboard(year,array,associate_name)})
}

function sumMontlyPaymets(data,month){
  let sum=data.monthlyPhotographer1[month]+data.monthlyPhotographer2[month]+data.monthlyVideographer1[month]+data.monthlyVideographer2[month]+data.monthlyEditor[month]+data.monthlyAlbums[month]+data.monthlyDrone[month];
  return sum;
}
function sumRolePayments(rolePayments){
  return rolePayments.reduce((a, b) => a + b, 0);  
}