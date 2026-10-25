// fetch() wrappers for offers, jobs, calendar, settings and archive endpoints

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


