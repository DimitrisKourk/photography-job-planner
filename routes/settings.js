// Settings: associates and products (/api/settings)
const express = require("express");
const { query } = require("../config/db");
const handle = require("../utils/handle");

const router = express.Router();

// ---- Associates ----

router.get("/settings/associates", handle(async (req, res) => {
  const text = `SELECT * FROM Associates ORDER BY id`;
  res.json(await query(text));
}));

router.post("/settings/associates", handle(async (req, res) => {
  const {firstname, surname, associate_type, email,phone} = req.body;
  const values = [firstname, surname, associate_type, email,phone];
  const text = `
      INSERT INTO Associates (firstname, surname, associate_type, email,phone)
      VALUES (?, ?, ?, ?, ?)`;
  await query(text, values);
  res.json(`New Associate added`);
}));

router.put("/settings/associates/:id", handle(async (req, res) => {
  //const id=parseInt(req.params.id);
  const {id,firstname, surname, associate_type, email,phone} = req.body;
  const values = [firstname, surname, associate_type, email,phone,id];
  const text = `UPDATE Associates
          SET firstname=?, surname=?, associate_type=?, email=?,phone=?
          WHERE id = ?`;
  await query(text, values);
  res.json(`Associate with ID: ${id} updated`);
}));

// ---- Products ----

router.get("/settings/products", handle(async (req, res) => {
  const text = `SELECT * FROM Products ORDER BY id`;
  res.json(await query(text));
}));

router.post("/settings/products", handle(async (req, res) => {
  const {id, product_name, price} = req.body;
  const values = [id, product_name, price];
  const text = `
      INSERT INTO Products (id, product_name, price)
      VALUES (?, ?, ?)`;
  await query(text, values);
  res.json(`New Product added`);
}));

router.put("/settings/products/:id", handle(async (req, res) => {
  const {id, product_name, price} = req.body;
  const values = [product_name, price,id];
  console.log(values);
  const text = `UPDATE Products
          SET product_name=?, price=?
          WHERE id = ?`;
  await query(text, values);
  res.json(`Product with ID: ${id} updated`);
}));

module.exports = router;
