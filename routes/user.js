'use strict'
const express= require('express')
let router = express.Router()

router.get("/test", (req, res) => {
     res.send("I got it")
   });

module.exports = router