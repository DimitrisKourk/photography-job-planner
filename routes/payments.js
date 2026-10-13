// Customer payments per job: /api/payments
const express = require("express");
const { query } = require("../config/db");
const handle = require("../utils/handle");

const router = express.Router();

router.get("/payments/:id", handle(async (req, res) => {
  const id=req.params.id;

  const values=[id];
  const text = `SELECT id,amount,date FROM CustomerPayments WHERE job_id=?`;
  res.json(await query(text, values));
}));

router.post("/payments/:id", handle(async (req, res) => {
  const {amount} = req.body;
  const job_id=req.params.id;
  const values = [amount, job_id];
  const text = `
      INSERT INTO CustomerPayments (amount, job_id)
      VALUES (?, ?)`;
  await query(text, values);
  res.json(`New payment added`);
}));

router.delete("/payments/delete/:id", handle(async (req, res) => {
  const id = req.params.id;
  const values = [id];
  const text = `DELETE FROM CustomerPayments WHERE id=?;`;
  res.json(await query(text, values));
}));

module.exports = router;
