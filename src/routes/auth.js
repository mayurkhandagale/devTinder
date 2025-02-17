const express = require("express");
const authRouter = express.Router();
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require('bcrypt');


authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    //Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
    });

    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email id!");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentails");
    }
    const isPasswordValid = user.validatePassword(password);
    if (isPasswordValid) {
      // Create a JWT Token
      const token = user.getJWT();
      // Add the token to cookie and send the response back
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
      res.send("Login succesful!");
    } else {
      throw new Error("Invalid credentails");
    }

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful!!");
});
module.exports = authRouter;