// calls required modules
const http = require("http");
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("./db-connection")
const { default: mongoose } = require("mongoose");
// calls morgan
var morgan = require("morgan");
/* initialises npm modules */
// using morgan middleware
app.use(morgan("tiny"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// middlewares not to store cache
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
// initiates cookie and session
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
  })
);

app.use(expressLayouts);
app.set("layout", "./layouts/page.ejs");
app.set("view engine", "ejs");

app.use(
  session({
    secret: "pass@mail.com",
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    resave: false,
  })
);

//navigates to routes
app.get("/signup", (req, res) => {
     res.render("signup");
   });

   var db = mongoose.connection;
app.post("/signup", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var data = {
    email: email,
    password: password,
  };
  mongoose.connection.collection("users").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    } else {
      console.log("data inserted");
      res.redirect("/login");
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
     try {
       const email = req.body.email;
       const password = req.body.password;
       const useremail = await mongoose.connection
         .collection("users")
         .findOne({ email: email });
       console.log(useremail.password);
       if (
         useremail.password === req.body.password &&
         useremail.email === req.body.email
       ) {
         req.session.user = req.body.email;
         res.redirect("/");
       } else {
         /* res.render('login', {err_messege: "invalid !1"})*/
         res.redirect("/login");
       }
     } catch {
       res.status(400).redirect("/login");
     }
     console.log(req.body.email);
     console.log(req.body.password);
   });

// logs out with destroying session
app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("logout successfully");
      res.redirect("/login");
    }
  });
});

app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});
app.post("/login", (req, res) => {
  if (req.body.email === user.userName && req.body.password == user.password) {
    req.session.user = req.body.email;
    console.log("Logged In");
    res.redirect("/");
  } else {
    res.render("login", { layout: "./layouts/invalid.ejs" });
  }
});

//server

http.createServer(app).listen(3000, () => {
  console.log("running");
});