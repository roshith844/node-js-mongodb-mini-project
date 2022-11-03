const express = require("express");
require("./db/conn.js");
const path = require("path")
const app = express();
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public")
// Middleware to acess public files
app.use(express.static(static_path))

app.get("/", (req, res) => {
  res.send("homepage");
});

app.listen(port, () => {
  console.log("server running");
});
