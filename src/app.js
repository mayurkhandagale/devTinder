const express = require('express');

const app = express();


//this will only handle GET call to /user
app.get('/user', (req, res) => {
  res.send({ firstName: "Mayur", lastName: "Khandagale" });
});

app.post('/user', (req, res) => {
  //logic to add data to DB
  res.send("POST data successfully");
});

app.delete('/user', (req, res) => {
  //logic to remove data from DB
  res.send("DELETE data successfully");
});

//this will match all the HTTP method API calls to /test
app.use("/user", (req, res) => {
  res.send("Welcome to Application!");
});

app.listen(5000, () => {
  console.log("Server listening on port 5000...");
});