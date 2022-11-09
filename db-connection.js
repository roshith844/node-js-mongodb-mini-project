const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/userData", {
    // For not getting depreciation warning from mongoose
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // useCreateIndex: true
  })
  .then(() => {
    console.log("connection success");
  })
  .catch((err) => {
    console.log(err);
  });
