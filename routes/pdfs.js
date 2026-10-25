// Contract PDFs: upload, download and link to offers/jobs
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

// links an uploaded PDF to an offer or a job
router.put("/associate-pdf", handle(async (req, res) => {
  const { type, id, file_name} = req.body;
  var text;
  if(type==="offer"){
    text = `UPDATE Offers
          SET pdf=?
          WHERE id = ?`;
  }
  else if(type==="job"){
    text = `UPDATE Jobs
          SET pdf=?
          WHERE id = ?`;
  }

  const values = [file_name,id];
  await query(text, values);
  res.json(`PDF uploaded successfully`);
}));

module.exports = router;
