// crew schedule table and availability section

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
    else if(job.job_type==="gamobaptisi"){
      schedule_table[day].push("ΓΑΜΟΒΑΠΤΙΣΗ-"+ job.job_name); 
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

