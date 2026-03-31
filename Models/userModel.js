const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Enter your userName'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Enter your password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message:
        'Incorrect password, make sure confirm password is the same as password',
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
