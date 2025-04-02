const express = require('express');
const usersControllers = require(`./../controllers/usersControllers`);

const user = express.Router();
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
