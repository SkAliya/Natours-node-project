const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppGlobalErrorClass = require('../utils/appGlobalError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

const sendEmail = require('../utils/email');

const generateToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const userData = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChanged: req.body.passwordChanged,
    role: req.body.role,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: req.body.passwordResetExpires,
  });

  // const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRESIN,
  // });  use the above func fo rtoken

  const token = generateToken(userData._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: userData,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) check email or password exits or not if not then retun
  const { email, password } = req.body;
  if (!email || !password)
    return next(
      new AppGlobalErrorClass(401, 'Please provide email or password!'),
    );
  // 2)find the curt user with email  if not match any user or email or passwrd wrong then send error 401 incorrt
  const user = await User.findOne({ email: email }).select('+password');
  // const correct = user.correctPassword(user.password, password);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppGlobalErrorClass(401, 'Incorrect email or password'));
  }
  // 3) if all crrt then send res
  res.status(200).json({
    status: 'success',
    token: generateToken(user._id),
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) GETTING THE TOKEN & CHECK IF EXITS
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // console.log(token);

  if (!token) {
    return next(
      new AppGlobalErrorClass(
        401,
        'Your not logged in, Please login to get access!',
      ),
    );
  }
  // 2) VERIFICATION TOKEN

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decode);

  // 3) CHECK IF USER STILL EXITS
  const freshUser = await User.findById(decode.id);

  if (!freshUser)
    return next(
      new AppGlobalErrorClass(
        401,
        'The user belonging to this token does no longer exits!',
      ),
    );

  // 4) CHECK IS USER CHANGED PASSWORD AFTER THE TOKEN HAS ISSUD
  if (freshUser.checkPasswordChanged(decode.iat)) {
    return next(
      new AppGlobalErrorClass(401, 'You changed password!, please login again'),
    );
  }

  //  5) IS ALL OK THEN NEXT()
  req.user = freshUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    //roles = ['admin','lead-guid']  role= 'user' not include
    if (!roles.includes(req.user.role)) {
      return next(
        new AppGlobalErrorClass(
          403,
          'You do not have purmissions to perform this action',
        ),
      );
    }
    next();
  };

exports.forgotpassword = catchAsync(async (req, res, next) => {
  // 1) GET USER BASED ON POSTED EMAIL

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    //if there is no user with that email
    return next(
      new AppGlobalErrorClass(404, "ther's no user with that email "),
    );
  }

  // 2) GENERATE THE RANDOM RESET TOKEN
  const resetToken = user.createForgotPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // await user.save();
  // user.save({validateBeforeSave:false}) u can also set this if validation is applying before saving
  //  3) SEND IT TO USER'S EMAIL
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;

  const message = `forgot your password ? please patch a request with new password to : ${resetURL} \n . if not . ignore this message`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token is valid for 10 minutes !!',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'token sent to the email ',
    });
  } catch (err) {
    // console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppGlobalErrorClass(
        500,
        'There was an error sending the email, Try again later!',
      ),
    );
  }
});

exports.resetpassword = (req, res, next) => {};
