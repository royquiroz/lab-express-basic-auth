const express = require("express");
const siteRoutes = express.Router();

siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

siteRoutes.get("/main", (req, res, next) => {
  res.render("index");
});

siteRoutes.get("/private", (req, res) => {
  res.render("secret");
});

module.exports = siteRoutes;
