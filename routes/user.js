"use strict";
const express = require("express");
const router = express.Router();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("../db-connection");
const Usermodel = require("../model/schema");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(expressLayouts);

// Middlewares not to store cache
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Initiates cookie and session
router.use(cookieParser());
router.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
  })
);

router.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    resave: false,
  })
);

// Routes
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  const newUser = new Usermodel({ email: email, password: password });
  newUser.save().then(() => {
    console.log("user added with model");
    res.redirect("/login");
  });
});

router.get("/login", (req, res) => {
  res.render("login", { msg: "" });
});

router.post("/login", async (req, res) => {
  try {
    const useremail = await Usermodel.findOne({ email: req.body.email });
    if (
      useremail.password == req.body.password &&
      useremail.email === req.body.email
    ) {
      req.session.user = req.body.email;
      res.render("login", { msg: "" });
    } else {
      res.render("login", { msg: "invalid credentials!! Try Again" });
    }
  } catch {
    res.status(400).render("login", { msg: "invalid credentials!! Try Again" });
  }
  console.log(req.body.email);
  console.log(req.body.password);
});

router.get("/logout", (req, res) => {
  // Destroys session
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("logout successfully");
      res.redirect("/login");
    }
  });
});

router.get("/", (req, res) => {
  if (req.session.user) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
