const express = require("express");
const authRoutes = express.Router();

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/User");

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //Campos vacios
  if (username == "" || password == "") {
    res.render("auth/signup", {
      errorMessage: "El username o password no puede estar vacio"
    });
  }

  User.findOne({ username: username }, "username")
    .then(user => {
      res.render("auth/signup", {
        errorMessage: `El usuario ${user.username} ya existe`
      });
    })
    .catch(err => {
      throw err;
    });

  const newUser = User({
    username,
    password: hashPass
  });

  newUser
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", {
        errorMessage: "Something went wrong"
      });
    });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      //res.json(user);
      res.render("index", { user });
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});

authRoutes.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = authRoutes;
