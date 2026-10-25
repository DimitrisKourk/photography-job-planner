// customer payments: form, list, owed amount

// payment dates come from the db as UTC ("...Z"); show them in greek time, 24h
function formatPaymentDate(date) {
  return new Date(date).toLocaleString("el-GR", {
    timeZone: "Europe/Athens",
    hour12: false,
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
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
    .then((json)=>{if(condition!="archive" && document.querySelector("#payments_owed_amount")){calculate_owed(offer_price,json);}})
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

// renders into the ΠΛΗΡΩΜΕΣ tab of the job details modal
function show_payments(Payments,job_id,offer_price){
  let payments_panel=document.querySelector(".modal .payments-panel");
  if (!payments_panel) return;

  var anHTML=`<h4>Τιμή: ${offer_price}</h4>
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
    anHTML += `<tr>
          <td>${payment.id}</td>
          <td>${payment.amount}</td>
          <td>${formatPaymentDate(payment.date)}</td>
          </tr>`;
  }
  anHTML += "</table>";
  payments_panel.innerHTML=anHTML;

  document.querySelector("#new_payment").addEventListener("click", a =>
    addPayment(job_id)
  );
  

  document.querySelector("#delete_payment").addEventListener("click",a => {
    var id=document.querySelector("#payment_form #payment_id").value;
    deletePayment(id,job_id);
  });

  document.querySelector("#payments_Table").addEventListener("click", selectPayment);

}

// renders into the ΠΛΗΡΩΜΕΣ tab of the archived job details modal
function show_payments_archived(Payments,offer_price){
  let payments_panel=document.querySelector(".modal .payments-panel");
  if (!payments_panel) return;

  var anHTML=`<h4>Τιμή: ${offer_price}</h4>
   <table id="payments_Table"><tr><th>Κωδικός</th><th>Ποσό</th><th>Ημ/νία Συναλλαγής</th></tr> 
  `;

  for (let payment of Payments) {
    anHTML += `<tr>
          <td>${payment.id}</td>
          <td>${payment.amount}</td>
          <td>${formatPaymentDate(payment.date)}</td>
          </tr>`;
  }
  anHTML += "</table>";
  payments_panel.innerHTML=anHTML;
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

