const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  // Logic to send the connnection request
  const user = req.user;
  res.send(user.firstName + " sent you a connection request!");
});

module.exports = requestRouter;