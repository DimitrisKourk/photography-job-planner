// pdf modal: preview, upload, linking a pdf to a job/offer

// with a container (the PDF tab of the job details) it renders there, otherwise in the popup modal
function show_pdf(type,id,pdf,container){
  // hide the timestamp prefix added on upload (older files have none)
  var pdf_display_name=pdf ? pdf.replace(/^\d{13}-/, "") : pdf;
  var archived=type==="archived_offer" || type==="archived_job";
  var tab_container=container;
  var anHTML;

  if(!pdf){
    anHTML=`<h2> ΔΕΝ ΥΠΑΡΧΕΙ ΣΥΣΧΕΤΙΣΜΕΝΟ PDF ΜΕ ΤΗ ΣΥΓΚΕΚΡΙΜΕΝΗ ΠΡΟΣΦΟΡΑ</h2>`;
    if(!archived){
      anHTML+=`
      <input type="file" id="select_pdf" name="pdf" accept="image/*,.pdf" single>
      <input id="upload_pdf" type="button" value="ΑΝΕΒΑΣΕ PDF">`;
    }
  }
  else{
    var pdf_url='/api/download-pdf/'+encodeURIComponent(pdf);
    anHTML=`<h2> ΒΡΕΘΗΚΕ ΣΥΣΧΕΤΙΣΜΕΝΟ PDF</h2>
      <h3>${pdf_display_name}</h3>`;
    if(!archived){
      anHTML+=`
      <input type="file" id="select_pdf" name="pdf" accept="image/*,.pdf" single>
      <input id="upload_pdf" type="button" value="ΑΝΤΙΚΑΤΑΣΤΑΣΗ">
      <input id="delete_pdf" class="danger-btn" type="button" value="ΔΙΑΓΡΑΦΗ PDF">`;
    }
    // preview on desktop; touch devices get a new tab button instead (CSS shows one or the other)
    anHTML+=`
      <input id="open_pdf_tab" class="pdf_open_tab" type="button" value="ΑΝΟΙΓΜΑ ΣΕ ΝΕΑ ΚΑΡΤΕΛΑ">
      <iframe class="pdf_preview" src="${pdf_url}?inline=1" title="${pdf_display_name}"></iframe>`;
  }

  if(container){
    container.innerHTML=anHTML;
  }
  else{
    var pdf_window=document.querySelector("#OfferPackageModal");
    pdf_window.innerHTML=`<div class="modal-content">
      <span class="close close2">&times;</span>
      ${anHTML}
      </div>`;
    pdf_window.style.display = "block";
    pdf_window.querySelector(".close2").onclick = function () {
      pdf_window.innerHTML = "";
      pdf_window.style.display = "none";
    };
    container=pdf_window;
  }

  var upload_btn=container.querySelector("#upload_pdf");
  if(upload_btn){
    upload_btn.addEventListener("click", function (){
      upload_pdf(type,id,tab_container);
    });
  }
  var delete_btn=container.querySelector("#delete_pdf");
  if(delete_btn){
    delete_btn.addEventListener("click", function (){
      delete_pdf(type,id,tab_container);
    });
  }
  if(pdf){
    container.querySelector("#open_pdf_tab").addEventListener("click", function (){
      window.open(pdf_url+"?inline=1", "_blank");
    });
  }
}


// removes the pdf from the offer/job and the server; like upload, the tab is redrawn and the popup reloads the page
function delete_pdf(type,id,container) {
  if(!confirm("Να διαγραφεί το PDF; Η ενέργεια δεν αναιρείται.")) return;
  fetch("/api/pdf/"+type+"/"+id, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(() => {
      if(container){
        show_pdf(type,id,"",container);
      }
      else{
        window.location.reload();
      }
    })
    .catch((err) => alert("Error occured: "+err.message));
}

// in the PDF tab the tab is redrawn after upload; the popup reloads the page as before
function upload_pdf(type,id,container) {
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
    .then((saved_name)=> associate_pdf(type,id,saved_name,container)) // server adds a timestamp prefix to the name
    .catch((err) => alert("Error occured", err));

}

function associate_pdf(mytype,myid,myfile_name,container){
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
    if(container){
      show_pdf(mytype,myid,myfile_name,container);
    }
    else if(confirm(json)){
      window.location.reload();
    }
    else{
      window.location.reload();
    }
  })
  .catch((err) => alert("Error occured", err));

}


