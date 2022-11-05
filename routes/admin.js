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
router.get("/", (req, res) => {
     if (req.session.user) {
       res.render("admin-home");
     } else {
       res.redirect("/admin/login");
     }
   });
// Admin login
router.get("/login", (req, res) => {
  res.render("admin-login");
});

router.post("/login", async (req, res) => {
     try {
       const name = req.body.name
       const email = req.body.email;
       const password = req.body.password;
       const adminemail = await mongoose.connection
         .collection("admins")
         .findOne({ email: email });
       console.log(adminemail);
       console.log(adminemail.password)
       console.log(req.body.password)
       console.log(adminemail.email)
       console.log(req.body.email)
       if (
         adminemail.password == req.body.password &&
         adminemail.email === req.body.email
         
       ) {
         req.session.user = req.body.email;
         res.redirect("/admin");
       } else {
         /* res.render('login', {err_messege: "invalid !1"})*/
         res.render("admin-login", { layout: "./layouts/invalid.ejs" });
       }
     } catch {
       res.status(400).render("admin-login", { layout: "./layouts/invalid.ejs" });
     }
   });
 
   router.get("/logout", (req, res) => {
     req.session.destroy((error) => {
       if (error) {
         console.log(error);
       } else {
         console.log("logout successfully");
         res.redirect("/admin/login");
       }
     });
   });

module.exports = router;
