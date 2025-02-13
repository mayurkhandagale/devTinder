const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50
  },
  lastName: {
    type: String,
    maxLength: 50
  },
  emailId: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address: " + value);
      }
    }
  },
  password: {
    type: String,
    validator(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Please enter a strong password: " + value);
      }
    },
    required: true
  },
  age: {
    type: Number,
    min: 18
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}\d{3}\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others", "Male", "Female", "Others"].includes(value)) {
        throw new Error("Gender data is not valid.");
      }
    }
  },
  photoUrl: {
    type: String,
    default: "https://geographyandyou.com/images/user-profile.png",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid photo URL");
      }
    }
  },
  about: {
    type: String,
    default: "This is a default user about!"
  },
  skills: {
    type: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);