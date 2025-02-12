const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
      const token = jwt.sign({ _id: user._id }, "DEV@tinder!123");

      // Add the token to cookie and send the response back
      res.cookie("token", token);
      res.send("Login succesful!");
    } else {
      throw new Error("Invalid credentails");
    }

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not founc");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong..");
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const { _id } = await jwt.verify(token, "DEV@tinder!123");

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
})

// Feed API - GET /feed  - get all the users form the database
app.get("/feed", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({});
    if (!users) {
      res.status(404).send("Users not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong...");
  }
});

// Delete a user form the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully...");
  } catch (err) {
    res.status(404).send("Something went wrong..");
  }
});

// Update the user form the database
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills", "phone"];
    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
    if (!isUpdateAllowed) {
      throw new Error("Update now allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills can not be more than 10")
    }
    const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "after", runValidators: true });
    res.send("User updated successfully.");
  } catch (err) {
    res.status(404).send("UPDATe FAILED: " + err.message);
  }
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

