const express = require("express");
const http = require("http");
require("./db/conn.js");

const path = require("path");
const hbs = require("hbs");
const { default: mongoose } = require("mongoose");
const app = express();

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Middleware to acess public files
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("register");
});
var db = mongoose.connection;
app.post("/reg", (req, res) => {
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

http.createServer(app).listen(3000);
