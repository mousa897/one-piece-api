const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
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

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

// check if password is correct
userSchema.methods.passwordCheck = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// create user model
const User = mongoose.model('User', userSchema);

module.exports = User;
