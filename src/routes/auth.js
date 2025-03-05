const express = require("express");
const authRouter = express.Router();
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');


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

    const savedUser = await user.save();
    const token = savedUser.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.json({ message: "User Added successfully", data: savedUser });
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
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Create a JWT Token
      const token = user.getJWT();
      // Add the token to cookie and send the response back
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
      res.send(user);
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

authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { emailId } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.emailId,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset link sent to email" });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decodedUser._id, resetToken: token });

    if (!user || usr.resetTokenExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();
    res.json({ message: "Password reset sucessful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})
module.exports = authRouter;