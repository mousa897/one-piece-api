const jwt = require('jsonwebtoken');
const User = require('./../Models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'Success',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and passwords exists
  if (!email || !password)
    return next(new AppError('Enter your email and password', 400));

  // check if email and password are correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.passwordCheck(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  // send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'Success',
    token,
  });
});
