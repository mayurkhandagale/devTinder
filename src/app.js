const express = require('express');

const app = express();

const { adminAuth, userAuth } = require('./middlewares/auth');

app.use("/admin", adminAuth);

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.get("/getUserData", (req, res) => {
  throw new Error("aldfkl");
  res.send("User data sent");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(5000, () => {
  console.log("Server listening on port 5000...");
});