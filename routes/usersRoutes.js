const express = require('express');

const usersControllers = require('./../controllers/usersControllers');

const authController = require('./../controllers/authController.js');

const user = express.Router();

// LOGIN
user.route('/signup').post(authController.signup);
user.route('/login').post(authController.login);
// RESETS & FORGOT
user.route('/forgotpassword').post(authController.forgotpassword);
user.route('/resetpassword/:token').patch(authController.resetpassword);

user.use(authController.protect);

// UPDATES
user.route('/updatepassword').patch(authController.updatepassword);
user.route('/updatedata').patch(usersControllers.updatedata);

// DELETES
user.route('/deleteuser').delete(usersControllers.deletecurrentuser);
// GET CURRT USER USING SIMPLE ROUTE NAME
user.route('/me').get(usersControllers.getMe, usersControllers.getSingleUser);

user.use(authController.restrictTo('admin'));

user
  .route('/')
  .get(usersControllers.getAllUsers)
  .post(usersControllers.createUser);

user
  .route('/:id')
  .get(usersControllers.getSingleUser)
  .patch(usersControllers.updateUser)
  .delete(usersControllers.deleteUser);

module.exports = user;
