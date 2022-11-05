const express = require("express");
const router = express.Router();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("../db-connection");
const { default: mongoose } = require("mongoose");

router.use(expressLayouts);
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// initiates cookie and session
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

// Admin login
router.get("/login", (req, res) => {
  res.render("admin-login");
});

router.post("/admin/login", (req, res) => {
  console.log(req.body);
});


module.exports = router;
