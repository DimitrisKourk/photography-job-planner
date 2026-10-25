// Contract PDFs: upload, download, link to offers/jobs and delete: /api/upload-pdf, /api/download-pdf/:pdf, /api/associate-pdf, /api/pdf/:type/:id
const express = require("express");
const { query } = require("../config/db");
const handle = require("../utils/handle");

const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// uploaded contract PDFs live in /PDFs
const pdfDirectory = path.join(__dirname, "..", "PDFs");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, pdfDirectory);
  },
  filename: function (req, file, callback) {
    const utf8Filename = Buffer.from(file.originalname, "latin1").toString("utf-8"); // accepting greek characters
    // timestamp prefix so an upload never overwrites another job's file with the same name
    callback(null, Date.now() + "-" + utf8Filename);
  },
});
const upload = multer({ storage });

router.get("/download-pdf/:pdf", (req, res) => {
  // basename strips any directory part, so "..%2F.env" can't reach files outside /PDFs
  const filename = path.basename(req.params.pdf);
  const filePath = path.join(pdfDirectory, filename);
  console.log(filePath);

  if (!fs.existsSync(filePath)) {
    console.log(`Error CAN NOT FIND the requested PDF`);
    return res.status(404).json("Error CAN NOT FIND the requested PDF");
  }

  // ?inline=1 shows the file in the browser (the preview iframe / new tab) instead of downloading it
  if (req.query.inline) {
    return res.sendFile(filePath, (err) => {
      if (err) {
        console.log(`Error Downloading the PDF`);
        if (!res.headersSent) res.status(404).json("Error Downloading the PDF");
      }
    });
  }

  // download under the original name, without the timestamp prefix added on upload
  res.download(filePath, filename.replace(/^\d{13}-/, ""), (err) => {
    if (err) {
      console.log(`Error Downloading the PDF`);
      if (!res.headersSent) res.status(404).json("Error Downloading the PDF");
    }
  });
});

router.post("/upload-pdf", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.status(200).json(req.file.filename); // the saved name, which the front end links to the offer/job
});

const pdfTables = { offer: "Offers", job: "Jobs" };

// deletes a PDF file from /PDFs unless an offer/job (live or archived) still points to it
async function removePdfIfUnused(pdf) {
  const text = `
      SELECT 1 FROM Offers WHERE pdf=?
      UNION ALL SELECT 1 FROM OffersArchive WHERE pdf=?
      UNION ALL SELECT 1 FROM Jobs WHERE pdf=?
      UNION ALL SELECT 1 FROM JobArchive WHERE pdf=?
      LIMIT 1`;
  const stillUsed = await query(text, [pdf, pdf, pdf, pdf]);
  if (stillUsed.length) return;
  // basename keeps the delete inside /PDFs; a file that's already gone is fine
  const filePath = path.join(pdfDirectory, path.basename(pdf));
  await fs.promises.unlink(filePath).catch((err) => { if (err.code !== "ENOENT") throw err; });
}

// links an uploaded PDF to an offer or a job; a replaced PDF's file is cleaned up
router.put("/associate-pdf", handle(async (req, res) => {
  const { type, id, file_name} = req.body;
  const table = pdfTables[type];
  if (!table) return res.status(400).json("Unknown type");

  const rows = await query(`SELECT pdf FROM ${table} WHERE id = ?`, [id]);
  const oldPdf = rows.length ? rows[0].pdf : "";

  await query(`UPDATE ${table} SET pdf=? WHERE id = ?`, [file_name, id]);
  if (oldPdf && oldPdf !== file_name) await removePdfIfUnused(oldPdf);
  res.json(`PDF uploaded successfully`);
}));

// unlinks the PDF from an offer or a job and deletes the file, unless another row (e.g. an archived copy) still uses it
router.delete("/pdf/:type/:id", handle(async (req, res) => {
  const table = pdfTables[req.params.type];
  if (!table) return res.status(400).json("Unknown type");

  const rows = await query(`SELECT pdf FROM ${table} WHERE id = ?`, [req.params.id]);
  const pdf = rows.length ? rows[0].pdf : "";
  if (!pdf) return res.json("No PDF to delete");

  await query(`UPDATE ${table} SET pdf='' WHERE id = ?`, [req.params.id]);
  await removePdfIfUnused(pdf);
  res.json("PDF deleted");
}));

module.exports = router;
