const express = require("express");
require("./db/conn.js");
const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("homepage");
});

app.listen(port, () => {
  console.log("server running");
});
