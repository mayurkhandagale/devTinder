const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email id!");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentails");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Create a JWT Token
      const token = jwt.sign({ _id: user._id }, "DEV@tinder!123", { expiresIn: "1d" });

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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  // Logic to send the connnection request
  const user = req.user;
  res.send(user.firstName + " sent you a connection request!");
})

connectDB()
  .then(() => {
    console.log("Database connection established..");
    app.listen(5000, () => {
      console.log("Server listening on port 5000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  })

