// Login and the two HTML pages: /, /management, /auth, /management/home
const express = require("express");
const fs = require("fs");
const path = require("path");
const { query } = require("../config/db");
const handle = require("../utils/handle");
const { LOGIN_PAGE } = require("../middleware/requireLogin");

const router = express.Router();
const APP_PAGE = path.join(__dirname, "..", "scripts", "index.html");
// optional public website: a deployment can add scripts/Home_Page.html to serve it at /
const HOME_PAGE = path.join(__dirname, "..", "scripts", "Home_Page.html");
const hasHomePage = fs.existsSync(HOME_PAGE);

// public website if there is one, otherwise straight to the login page (the demo has none)
router.get("/", (req, res) => {
  if (hasHomePage) return res.sendFile(HOME_PAGE);
  res.redirect("/management");
});

router.get("/management", (req, res) => {
  res.sendFile(LOGIN_PAGE);
});

router.post("/auth", handle(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send("Please enter Username and Password!");
  }

  const results = await query("SELECT * FROM accounts WHERE username = ? AND password = ?", [username, password]);
  if (results.length === 0) {
    return res.send("Incorrect Username and/or Password!");
  }

  req.session.loggedin = true;
  req.session.username = username;
  req.session.cookie.maxAge = 7 * 24 * 3600 * 1000; // 1 week
  req.session.cookie.secure = process.env.NODE_ENV === "production"; // https only in production
  req.session.cookie.httpOnly = true;
  res.redirect("/management/home");
}));

router.get("/management/home", (req, res) => {
  res.sendFile(req.session.loggedin ? APP_PAGE : LOGIN_PAGE);
});

module.exports = router;
