const path = require("path");

const LOGIN_PAGE = path.join(__dirname, "..", "scripts", "login.html");

// Lets the request through only for logged-in users; everyone else gets the login page.
function requireLogin(req, res, next) {
  if (req.session.loggedin) return next();
  res.sendFile(LOGIN_PAGE);
}

module.exports = requireLogin;
module.exports.LOGIN_PAGE = LOGIN_PAGE;
