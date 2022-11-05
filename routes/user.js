'use strict'
const express= require('express')
let router = express.Router()

router.get("/login", (req, res) => {
     res.render("login");
   });

router.get("/logout", (req, res) => {
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
router.post("/form-submit", (req, res) => {
     if (req.body.email === user.userName && req.body.password == user.password) {
       req.session.user = req.body.email;
       console.log("Logged In");
       res.redirect("/");
     } else {
       res.render("login", { layout: "./layouts/invalid.ejs" });
     }
   });

module.exports = router

// for app.js
