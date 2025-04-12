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
// user.post('/forgotpassword', authController.forgotpassword);
// user.patch('/resetpassword/:token', authController.resetpassword);

// UPDATES
user
  .route('/updatepassword')
  .patch(authController.protect, authController.updatepassword);

user
  .route('/updatedata')
  .patch(authController.protect, usersControllers.updatedata);

// DELETES
user
  .route('/deleteuser')
  .delete(authController.protect, usersControllers.deletecurrentuser);

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
