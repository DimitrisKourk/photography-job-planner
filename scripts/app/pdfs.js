// pdf modal: preview, upload, linking a pdf to a job/offer

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


