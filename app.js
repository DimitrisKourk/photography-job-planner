// Photography Job Planner: Express server setup.
// The API routes live in routes/, one file per section of the app.
const express = require("express");
const session = require("express-session");
const path = require("path");

const requireLogin = require("./middleware/requireLogin");

const app = express();
const port = process.env.port || 4000;

// request bodies (JSON from the front end, form data from the login page)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: "CustomCookie",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// static files
app.use("/management/images", express.static(path.join(__dirname, "images")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/css", express.static(path.join(__dirname, "CSS")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));

// login + HTML pages
app.use("/", require("./routes/auth"));

// everything under /api requires a logged-in user
app.use("/api", requireLogin);
app.use("/api", require("./routes/offers"));
app.use("/api", require("./routes/jobs"));
app.use("/api", require("./routes/archive"));
app.use("/api", require("./routes/settings"));
app.use("/api", require("./routes/payments"));
app.use("/api", require("./routes/dashboard"));
app.use("/api", require("./routes/calendar"));
app.use("/api", require("./routes/pdfs"));

// error handler (e.g. a failed PDF upload)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, function () {
  console.log("Server is running on port " + port);
});
