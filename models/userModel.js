const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name,email,photo,password,passwordconfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
    minLength: [6, 'A user name must be above 6 characters '],
    maxLength: [40, 'A user name must be below 40 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    validate: validator.isStrongPassword,
    minLength: [8, 'Password must be above 8 characters '],
    maxLength: [30, 'Password must be below 30 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    // ONLY WORKS FOR SAVE NOT FOR FIND1 & UPDATE ONLY WORKS FOR .SAVE /.CREATE
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Confirm Password must be match with Password',
    },
  },
  passwordChanged: Date,
});

// MIDDLEWARE FOR PASSWRD ENCRYPTING
userSchema.pre('save', async function (next) {
  // ONLY RUN THIS FUNC IF PASSD WAS ACTULLY UPDATED OR CREATED NEW
  if (!this.isModified('password')) return next();

  //HASH THE PASSWRD WITH COST OF 12
  this.password = await bcrypt.hash(this.password, 12);

  //DELETE PASSWRDCONFIRM FIELD
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkPasswordChanged = function (jwtTimeStampIAT) {
  console.log(this.passwordChanged);
  if (this.passwordChanged) {
    const passwordChangedTimeStamp = parseInt(
      this.passwordChanged.getTime() / 1000,
      10,
    );
    console.log(
      passwordChangedTimeStamp,
      jwtTimeStampIAT,
      this.passwordChanged,
    );
    return jwtTimeStampIAT < passwordChangedTimeStamp;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
