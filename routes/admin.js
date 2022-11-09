const express = require("express");
const router = express.Router();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");

require("../db-connection"); // Connects to Database

// Calls Schema for MongoDB
const Adminmodel = require("../model/adminSchema");
const Usermodel = require("../model/schema");

// MiddleWares
router.use(expressLayouts);
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store"); // For Not Storing Caxhe
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

/* Routes */

router.get("/login", (req, res) => {
  res.render("admin-login", { msg: "" });
});

router.post("/login", async (req, res) => {
  try {
    const adminemail = await Adminmodel.findOne({ email: req.body.email }); // Gets Doc

    // Validates Password
    if (adminemail.password == req.body.password) {
      req.session.user = req.body.email; // Creates Session
      res.redirect("/admin");
    } else {
      res.render("admin-login", { msg: "Invalid!! Please Try Again" });
    }
  } catch {
    res
      .status(400)
      .render("admin-login", { msg: "Invalid!! Please Try Again" });
  }
});

router.get("/logout", (req, res) => {
  // Destroys session
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("logout successfully");
      res.redirect("/admin/login");
    }
  });
});

router.get("/", (req, res) => {
  if (req.session.user) {
    // Gets all Data from Database
    Usermodel.find({}, { email: 1, password: 1 }).then((result) => {
      res.render("admin-home", { data: result });
    });
  } else {
    res.redirect("/admin/login");
  }
});

router.post("/search", (req, res) => {
  if (req.session.user) {
    // Searches From DataBase
    Usermodel.find({ email: req.body.searchInput }).then((result) => {
      res.render("admin-home", { data: result });
    });
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/create-user", (req, res) => {
  if (req.session.user) {
    res.render("create-user");
  } else {
    res.redirect("/admin/login");
  }
});

router.post("/create-user", (req, res) => {
  if (req.session.user) {
    var email = req.body.email;
    var password = req.body.password;
    const newUser = new Usermodel({ email: email, password: password });
    newUser.save().then(() => {
      console.log("user added by Admin");
      res.redirect("/admin");
    });
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/edit-user/:id", (req, res) => {
  if (req.session.user) {
    Usermodel.find({ _id: req.params.id }).then((result) => {
      console.log(result);
      res.render("edit-user", { data: result });
    });
  } else {
    res.redirect("/admin/login");
  }
});

router.post("/edit-user", (req, res) => {
  if (req.session.user) {
    Usermodel.replaceOne(
      { _id: req.body.dbId },
      { email: req.body.email, password: req.body.password }
    ).then(() => {
      console.log("data modified");
      res.redirect("/admin");
    });
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/delete-user/:id", (req, res) => {
  if (req.session.user) {
    const userId = req.params.id;
    Usermodel.deleteOne({ _id: userId }).then(() => {
      console.log("user deleted");
      res.redirect("/admin");
    });
  } else {
    res.redirect("/admin/login");
  }
});

module.exports = router;
