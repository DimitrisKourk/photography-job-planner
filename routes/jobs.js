// Booked jobs: /api/jobs, /api/createJob
const express = require("express");
const { query, multiQuery } = require("../config/db");
const handle = require("../utils/handle");

const router = express.Router();

router.post("/jobs/:id", handle(async (req, res) => {
  const id = req.params.id;
  const { offer_type, offer_name, name1, name2, phone,church,EventLocation,date,offer_package,price,description,pdf} = req.body;

  const values = [offer_type, offer_name, name1, name2, phone,church,EventLocation,date,"",'00:00',"",'00:00',offer_package,price,description,0,0,0,0,0,0,0,0,0,0,0,pdf,false,false,false,false,false,false,false,id];
  const text = `
      INSERT INTO Jobs (job_type, job_name, name1, name2, phone,church,EventLocation,date,groom_place,groom_time,bride_place,bride_time,offer_package,price,description, task1, task2, task3, task4, task5, task6, task7, task8, task9, task10, task11,pdf,ph1_pay_done,ph2_pay_done,vid1_pay_done,vid2_pay_done,drone_pay_done,printer_pay_done,editor_pay_done)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
      DELETE FROM Offers WHERE id = ?`;
  await multiQuery(text, values);
  res.json(`New Job added`);
}));

router.post("/createJob", handle(async (req, res) => {
  const { offer_type, offer_name, name1, name2, phone,church,EventLocation,date,offer_package,price,description,pdf} = req.body;

  const values = [offer_type, offer_name, name1, name2, phone,church,EventLocation,date,"",'00:00',"",'00:00',offer_package,price,description,0,0,0,0,0,0,0,0,0,0,0,pdf,false,false,false,false,false,false,false];
  const text = `
      INSERT INTO Jobs (job_type, job_name, name1, name2, phone,church,EventLocation,date,groom_place,groom_time,bride_place,bride_time,offer_package,price,description, task1, task2, task3, task4, task5, task6, task7, task8, task9, task10, task11,pdf,ph1_pay_done,ph2_pay_done,vid1_pay_done,vid2_pay_done,drone_pay_done,printer_pay_done,editor_pay_done)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     `;
  await query(text, values);
  res.json(`New Job added`);
}));

router.get("/jobs/filtered/:dates", handle(async (req, res) => {
  const filter=req.params.dates.split(',');
  const year=filter[0];
  const month=filter[1];
  var values;
  var text;
  if(month==='0'){
    values=[year];
    text = `SELECT id,job_name,job_type,date,price,(SELECT COALESCE(SUM(amount),0) FROM CustomerPayments WHERE job_id=Jobs.id) AS paid FROM Jobs WHERE year(date)=? ORDER BY date`;
    }
  else{
    values=[year,month];
    text = `SELECT id,job_name,job_type,date,price,(SELECT COALESCE(SUM(amount),0) FROM CustomerPayments WHERE job_id=Jobs.id) AS paid FROM Jobs WHERE year(date)=? AND month(date)=? ORDER BY date`;
    }
  res.json(await query(text, values));
}));

router.get("/jobs/filtered/status/:dates", handle(async (req, res) => {
  const filter=req.params.dates.split(',');
  const year=filter[0];
  const month=filter[1];
  var values;
  var text;
  if(month==='0'){
    values=[year];
      text = `SELECT id,job_type,job_name,date,task1,task2,task3,task4,task5,task6,task7,task8,task9,task10,task11 FROM Jobs WHERE year(date)=? ORDER BY date`;
    }
  else{
    values=[year,month];
      text = `SELECT id,job_type,job_name,date,task1,task2,task3,task4,task5,task6,task7,task8,task9,task10,task11 FROM Jobs WHERE year(date)=? AND month(date)=? ORDER BY date`;
    }
  res.json(await query(text, values));
}));

router.get("/jobs/details/:id", handle(async (req, res) => {
  const id = req.params.id;
  const values = [id];
  const text = `SELECT * FROM Jobs WHERE id = ? ORDER BY date`;
  res.json(await query(text, values));
}));

router.put("/jobs/:id", handle(async (req, res) => {
  const id=req.params.id;
  const { job_type, job_name, name1, name2, phone,church,EventLocation,date,groom_place,groom_time,bride_place,bride_time,offer_package,price,description,task1,task2,task3,task4,task5,task6,task7,task8,task9,task10,task11,photographer1,photographer2,videographer1,videographer2,album_printer,video_editor,drone,sent_to_editor,recieved_from_editor,sent_to_printer,recieved_from_printer,ph1_payment,ph2_payment,vid1_payment,vid2_payment,drone_payment,printer_payment,editor_payment,ph1_pay_done,ph2_pay_done,vid1_pay_done,vid2_pay_done,drone_pay_done,printer_pay_done,editor_pay_done} = req.body;
  const values = [job_type, job_name, name1, name2, phone,church,EventLocation,date,groom_place,groom_time,bride_place,bride_time,offer_package,price,description,task1,task2,task3,task4,task5,task6,task7,task8,task9,task10,task11,photographer1,photographer2,videographer1,videographer2,album_printer,video_editor,drone,sent_to_editor,recieved_from_editor,sent_to_printer,recieved_from_printer,ph1_payment,ph2_payment,vid1_payment,vid2_payment,drone_payment,printer_payment,editor_payment,ph1_pay_done,ph2_pay_done,vid1_pay_done,vid2_pay_done,drone_pay_done,printer_pay_done,editor_pay_done,id];
  for(let i=0;i<values.length;i++){
    if(values[i]===''){values[i]=null;}
  };
  console.log(values);
  const text = `UPDATE Jobs
          SET job_type=?, job_name=?, name1=?, name2=?,phone=?, church=?,EventLocation=?,date=?,groom_place=?,groom_time=?,bride_place=?,bride_time=?,offer_package=?,price=?,description=?,task1=?,task2=?,task3=?,task4=?,task5=?,task6=?,task7=?,task8=?,task9=?,task10=?,task11=?,photographer1=?,photographer2=?,videographer1=?,videographer2=?,album_printer=?,video_editor=?,drone=?,sent_to_editor=?,recieved_from_editor=?,sent_to_printer=?,recieved_from_printer=?,ph1_payment=?,ph2_payment=?,vid1_payment=?,vid2_payment=?,drone_payment=?,printer_payment=?,editor_payment=?,ph1_pay_done=?,ph2_pay_done=?,vid1_pay_done=?,vid2_pay_done=?,drone_pay_done=?,printer_pay_done=?,editor_pay_done=?
          WHERE id = ?`;
  await query(text, values);
  res.json(`Job with ID: ${id} updated`);
}));

router.get("/jobs/filtered/schedule/:dates", handle(async (req, res) => {
  const filter=req.params.dates.split(',');
  const year=filter[0];
  const month=filter[1];
  const values=[year,month];
  const text = `SELECT id,date,photographer1,photographer2,videographer1,videographer2,drone FROM Jobs WHERE year(date)=? AND month(date)=? ORDER BY date`;
  res.json(await query(text, values));
}));

module.exports = router;
