const express = require('express');

const app = express();

const { adminAuth, userAuth } = require('./middlewares/auth');

app.use("/admin", adminAuth);

app.use("/admin/getData", (req, res, next) => {
  res.send("Admin data sent");
})

app.get("/user/getData", userAuth, (req, res, next) => {
  res.send('User data sent!');
});

app.get("/user/login", (req, res, next) => {
  res.send("User logged in successfully!!");
})

app.listen(5000, () => {
  console.log("Server listening on port 5000...");
});