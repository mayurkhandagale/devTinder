const express = require('express');
const connectDB = require("./config/database");
const app = express();

connectDB()
  .then(() => {
    console.log("Database connection established..");
    app.listen(5000, () => {
      console.log("Server listening on port 5000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  })

