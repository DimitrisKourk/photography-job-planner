// Archived offers and jobs: /api/archive
const express = require("express");
const { query, multiQuery } = require("../config/db");
const handle = require("../utils/handle");

const router = express.Router();

// ---- Offers ----

router.post("/archive/offers/:id", handle(async (req, res) => {
  const id = req.params.id;
  const { offer_type, offer_name, name1, name2, phone,church,EventLocation,date,offer_package,price,description,pdf} = req.body;
  const values = [offer_type, offer_name, name1, name2, phone,church,EventLocation,date,offer_package,price,description,pdf,id];
  const text = `
      INSERT INTO OffersArchive (offer_type, offer_name, name1, name2,phone, church,EventLocation,date,offer_package,price,description,pdf)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?);
      DELETE FROM Offers WHERE id = ?`;
  await multiQuery(text, values);
  res.json(`Offer Archived Successfully`);
}));

router.get("/archive/offers/filtered/:dates", handle(async (req, res) => {
  const filter=req.params.dates.split(',');
  const year=filter[0];
  const month=filter[1];
  var values;
  var text;
  if(month==='0'){
    values=[year];
    text = `SELECT id,offer_name,date FROM OffersArchive WHERE year(date)=? ORDER BY date`;
    }
  else{
    values=[year,month];
    text = `SELECT id,offer_name,date FROM OffersArchive WHERE year(date)=? AND month(date)=? ORDER BY date`;
    }
  res.json(await query(text, values));
}));

router.get("/archive/offers/details/:id", handle(async (req, res) => {
  const id = req.params.id;
  const values = [id];
  const text = `SELECT * FROM OffersArchive WHERE id = ?`;
  res.json(await query(text, values));
}));

router.delete("/archive/offers/restore/:id", handle(async (req, res) => {
  const id = req.params.id;
  const values = [id,id];
  const text = `INSERT INTO Offers (offer_type, offer_name, name1, name2, phone,church,EventLocation,date,offer_package,price,description,pdf)
                SELECT offer_type, offer_name, name1, name2, phone,church,EventLocation,date,offer_package,price,description,pdf FROM OffersArchive WHERE id = ?;
                DELETE FROM OffersArchive WHERE id=?;`;
  res.json(await multiQuery(text, values));
}));

router.delete("/archive/offers/delete/:id", handle(async (req, res) => {
  const id = req.params.id;
  const values = [id];
  const text = `DELETE FROM OffersArchive WHERE id=?;`;
  res.json(await query(text, values));
}));

// ---- Jobs ----

router.post("/archive/jobs/:id", handle(async (req, res) => {
  const id = req.params.id;
  const { job_type, job_name, name1, name2, phone,church,EventLocation,date,groom_place,groom_time,bride_place,bride_time,offer_package,price,description,task1,task2,task3,task4,task5,task6,task7,task8,task9,task10,task11,photographer1,photographer2,videographer1,videographer2,album_printer,video_editor,drone,sent_to_editor,recieved_from_editor,sent_to_printer,recieved_from_printer,ph1_payment,ph2_payment,vid1_payment,vid2_payment,drone_payment,printer_payment,editor_payment,pdf,ph1_pay_done,ph2_pay_done,vid1_pay_done,vid2_pay_done,drone_pay_done,printer_pay_done,editor_pay_done} = req.body;
  const values = [id,job_type, job_name, name1, name2,phone, church,EventLocation,date,groom_place,groom_time,bride_place,bride_time,offer_package,price,description,photographer1,photographer2,videographer1,videographer2,album_printer,video_editor,drone,sent_to_editor,recieved_from_editor,sent_to_printer,recieved_from_printer,ph1_payment,ph2_payment,vid1_payment,vid2_payment,drone_payment,printer_payment,editor_payment,pdf,ph1_pay_done,ph2_pay_done,vid1_pay_done,vid2_pay_done,drone_pay_done,printer_pay_done,editor_pay_done,id];

  const text = `
      INSERT INTO JobArchive (id,job_type, job_name, name1, name2, phone,church,EventLocation,date,groom_place,groom_time,bride_place,bride_time,offer_package,price,description,photographer1,photographer2,videographer1,videographer2,album_printer,video_editor,drone,sent_to_editor,recieved_from_editor,sent_to_printer,recieved_from_printer,ph1_payment,ph2_payment,vid1_payment,vid2_payment,drone_payment,printer_payment,editor_payment,pdf,ph1_pay_done,ph2_pay_done,vid1_pay_done,vid2_pay_done,drone_pay_done,printer_pay_done,editor_pay_done)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
      DELETE FROM Jobs WHERE id = ?`;
  await multiQuery(text, values);
  res.json(`Job Archived Successfully`);
}));

router.get("/archive/jobs/filtered/:dates", handle(async (req, res) => {
  const filter=req.params.dates.split(',');
  const year=filter[0];
  const month=filter[1];
  var values;
  var text;
  if(month==='0'){
    values=[year];
    text = `SELECT id,job_name,date FROM JobArchive WHERE year(date)=? ORDER BY date`;
    }
  else{
    values=[year,month];
    text = `SELECT id,job_name,date FROM JobArchive WHERE year(date)=? AND month(date)=? ORDER BY date`;
    }
  res.json(await query(text, values));
}));

router.get("/archive/jobs/details/:id", handle(async (req, res) => {
  const id = req.params.id;
  const values = [id];
  const text = `SELECT * FROM JobArchive WHERE id = ?`;
  res.json(await query(text, values));
}));

// note: restoring gives the job a new id (auto-increment), so its customer payments are re-linked to it
router.delete("/archive/jobs/restore/:id", handle(async (req, res) => {
  const id = req.params.id;
  const values = [id,id,id];
  const text = `INSERT INTO Jobs (job_type, job_name, name1, name2, phone,church,EventLocation,date,groom_place,groom_time,bride_place,bride_time,offer_package,price,description,pdf,photographer1,photographer2,videographer1,videographer2,album_printer,video_editor,drone,sent_to_editor,recieved_from_editor,sent_to_printer,recieved_from_printer,ph1_payment,ph2_payment,vid1_payment,vid2_payment,drone_payment,printer_payment,editor_payment,ph1_pay_done,ph2_pay_done,vid1_pay_done,vid2_pay_done,drone_pay_done,printer_pay_done,editor_pay_done)
                SELECT job_type, job_name, name1, name2, phone,church,EventLocation,date,groom_place,groom_time,bride_place,bride_time,offer_package,price,description,pdf,photographer1,photographer2,videographer1,videographer2,album_printer,video_editor,drone,sent_to_editor,recieved_from_editor,sent_to_printer,recieved_from_printer,ph1_payment,ph2_payment,vid1_payment,vid2_payment,drone_payment,printer_payment,editor_payment,ph1_pay_done,ph2_pay_done,vid1_pay_done,vid2_pay_done,drone_pay_done,printer_pay_done,editor_pay_done FROM JobArchive WHERE id = ?;
                UPDATE CustomerPayments set job_id=LAST_INSERT_ID() where job_id=?;
                DELETE FROM JobArchive WHERE id=?;`;
  res.json(await multiQuery(text, values));
}));

router.delete("/archive/jobs/delete/:id", handle(async (req, res) => {
  const id = req.params.id;
  const values = [id,id];
  const text = `DELETE FROM JobArchive WHERE id=?;
                DELETE FROM CustomerPayments WHERE job_id=?;`;
  res.json(await multiQuery(text, values));
}));

module.exports = router;
