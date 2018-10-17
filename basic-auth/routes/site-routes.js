const express = require("express");
const siteRoutes = express.Router();

siteRoutes.get("/main", (req, res, next) => {
  res.render("index");
});

siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/signup");
  }
});

siteRoutes.get("/private", (req, res) => {
  res.render("secret");
});

module.exports = siteRoutes;
