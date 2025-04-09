const express = require('express');
const usersControllers = require(`./../controllers/usersControllers`);
const authController = require(`./../controllers/authController`);

const user = express.Router();
user.route('/signup').post(authController.signup);
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
