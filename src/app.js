const express = require('express');

const app = express();

//this will only handle GET call to /user
app.get('/user', (req, res, next) => {
  console.log("Handling the route user!");
  next();
},
  (req, res, next) => {
    console.log("Handling the route user 2!");
    //res.send("2nd User");
    next();
  },
  (req, res, next) => {
    console.log("Handling the route user 3!");
    res.send("3rd User ");
  }
);

app.post('/user', (req, res) => {
  //logic to add data to DB
  res.send("POST data successfully");
});

app.get("/user/:id/:name", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Mayur", lastName: "Khandagale" });
})

app.listen(5000, () => {
  console.log("Server listening on port 5000...");
});