const mongoose = require("mongoose")
const dataSchema = new mongoose.Schema({
     email: {
          type: String,
          required: true,
          unique: true
     },
     password: {
          type: String,
          required: true
     }
}) 