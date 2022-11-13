const mongoose = require("mongoose");

// Example for Localhost MongoDB connection Link :mongodb://localhost:27017/userData//

mongoose
  .connect("mongodb+srv://roshith:7906@cluster0.qvn5gxo.mongodb.net/userData?retryWrites=true&w=majority", {
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
