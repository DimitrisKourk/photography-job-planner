// form readers for jobs/offers/calendar events, date filter, flatpickr setup

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

// replaces native date/time inputs with flatpickr so times are always shown in 24h format
// the underlying values keep the native format ("YYYY-MM-DDTHH:MM" / "HH:MM") so the form readers don't change
function initDatePickers(container) {
  container.querySelectorAll("input[type=datetime-local]").forEach(function (input) {
    var value = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(input.value) ? input.value.slice(0, 16) : "";
    input.type = "text";
    flatpickr(input, {
      enableTime: true,
      time_24hr: true,
      dateFormat: "Y-m-dTH:i",
      altInput: true,
      altFormat: "j-n-Y H:i",
      locale: "gr",
      disableMobile: true,
      defaultDate: value || null
    });
  });
  container.querySelectorAll("input[type=time]").forEach(function (input) {
    var value = /^\d{2}:\d{2}/.test(input.value) ? input.value.slice(0, 5) : "";
    input.type = "text";
    flatpickr(input, {
      enableTime: true,
      noCalendar: true,
      time_24hr: true,
      dateFormat: "H:i",
      locale: "gr",
      disableMobile: true,
      defaultDate: value || null
    });
  });
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

