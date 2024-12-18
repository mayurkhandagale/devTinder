const express = require('express');

const app = express();


app.use("/test", (req, res) => {
  res.send("Welcome to Application!");
});

app.use("/hello/", (req, res) => {
  res.send("Welcome to Test!");
});

app.listen(5000, () => {
  console.log("Server listening on port 5000...");
});