const express = require('express');
const toursControllers = require(`./../controllers/toursControllers`);

const tour = express.Router();

// tour.param('id', (req, res, next, val) => {
//   console.log(`tour id is : ${val}`);
//   next();
// });
// now place this callback middleware func in controllers files nd export it

tour
  .route('/')
  .get(toursControllers.getReq)
  .post(toursControllers.checkBody, toursControllers.postReq); //chaining multiple middlware func

tour.param('id', toursControllers.checkId);

tour
  .route('/:id')
  .get(toursControllers.getSingleReq)
  .patch(toursControllers.patchReq)
  .delete(toursControllers.deleteReq);

module.exports = tour;
