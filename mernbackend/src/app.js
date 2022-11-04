const express = require("express");
const http = require("http");
const session = require('express-session')
const cookieParser = require('cookie-parser')
require("./db/conn.js");

const path = require("path");
const hbs = require("hbs");
const { default: mongoose } = require("mongoose");
const app = express();

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// middlewares not to store cache
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Middleware to acess public files
app.use(express.static(static_path));
// initiates cookie and session
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
  })
);
app.use(
  session({
    secret: "pass@mail.com",
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    resave: false,
  })
);

app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

app.get("/signup", (req, res) => {
  res.render("register");
});
app.get('/', (req, res)=>{
/*  if (req.session.user) {*/
    res.render("index");
 /* } else {
    res.redirect("/login");
  }*/
})

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
      res.render("index");
    }
  });
});
app.get('/login', (req,res)=>{
  /* req.session.user = req.body.email; */
  res.render("login")
})
// logs out with destroying session
app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("logout successfully");
      res.redirect("/login");
    }
  })
})
http.createServer(app).listen(3000);
