// settings modal: associates and products tables and forms

document.querySelector(".settings img").addEventListener("click", function () {
  open_settings();
});

function open_settings() {
  let anHTML = `<div class="modal-content">
         <span class="close">&times;</span>
<div class="tab-bar" role="tablist">
  <button type="button" class="tab-btn" role="tab" id="associates-btn">Συνεργάτες</button>
  <button type="button" class="tab-btn" role="tab" id="prices-btn">Τιμοκατάλογος</button>
  <button type="button" class="tab-btn" role="tab" id="schedule-btn">Πρόγραμμα</button>
  <button type="button" class="tab-btn" role="tab" id="general-btn">Γενικά</button>
</div>

<div id="SettingsTabContent">

</div>

</div>`;
         
  
  modal.innerHTML = anHTML;
  modal.style.display = "block";
  // the tabs here re-render #SettingsTabContent instead of switching panels
  initTabs(modal);
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
  initCollapsibles(content);

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
  initCollapsibles(content);

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
