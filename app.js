// calls required modules
const http = require("http");
const express = require("express");
const app = express();
require("./db-connection");
// Routers
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
app.use("/", userRouter);
app.use("/admin", adminRouter);
/********/
app.set("layout", "./layouts/page.ejs");
app.set("view engine", "ejs");

//server

http.createServer(app).listen(3000, () => {
  console.log("running");
});
