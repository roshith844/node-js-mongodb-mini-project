const express = require("express");
const http = require("http");
const userRoute = require("./routes/user")
const app = express()

app.use('/', userRoute )
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(3000)