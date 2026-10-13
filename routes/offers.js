// Offers (customer quotes): /api/offers
const express = require("express");
const { query } = require("../config/db");
const handle = require("../utils/handle");

const router = express.Router();

router.post("/offers", handle(async (req, res) => {
  const { offer_type, offer_name, name1, name2, phone,church,EventLocation,date,offer_package,price,description} = req.body;
  const values = [offer_type, offer_name, name1, name2,phone, church,EventLocation,date,offer_package,price,description,""];
  const text = `
      INSERT INTO Offers (offer_type, offer_name, name1, name2,phone, church,EventLocation,date,offer_package,price,description,pdf)
      VALUES (?, ?, ?, ?, ?, ?,?, ?, ?,?,?,?)`;
  await query(text, values);
  res.json(`New Offer added`);
}));

router.get("/offers/filtered/:dates", handle(async (req, res) => {
  const filter=req.params.dates.split(',');
  const year=filter[0];
  const month=filter[1];
  var values;
  var text;
  if(month==='0'){
    values=[year];
    text = `SELECT id,offer_name,date FROM Offers WHERE year(date)=? ORDER BY date`;
  }
  else{
    values=[year,month];
    text = `SELECT id,offer_name,date FROM Offers WHERE year(date)=? AND month(date)=? ORDER BY date`;
  }
  res.json(await query(text, values));
}));

router.get("/offers/details/:id", handle(async (req, res) => {
  const id = req.params.id;
  const values = [id];
  const text = `SELECT * FROM Offers WHERE id = ? ORDER BY date`;
  res.json(await query(text, values));
}));

router.put("/offers/:id", handle(async (req, res) => {
  const id=req.params.id;
  const { offer_type, offer_name, name1, name2, phone,church,EventLocation,date,offer_package,price,description} = req.body;
  const values = [offer_type, offer_name, name1, name2, phone,church,EventLocation,date,offer_package,price,description,id];
  const text = `UPDATE Offers
          SET offer_type=?, offer_name=?, name1=?, name2=?,phone=?, church=?,EventLocation=?,date=?,offer_package=?,price=?,description=?
          WHERE id = ?`;
  await query(text, values);
  res.json(`Offer with ID: ${id} updated`);
}));

module.exports = router;
