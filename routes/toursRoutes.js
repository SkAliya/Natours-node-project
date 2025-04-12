const express = require('express');
const toursControllers = require('./../controllers/toursControllers');
const authController = require('./../controllers/authController');

const tour = express.Router();

// tour.param('id', (req, res, next, val) => {
//   console.log(`tour id is : ${val}`);
//   next();
// });
// now place this callback middleware func in controllers files nd export it

tour
  .route('/top-5-cheap-tours')
  .get(toursControllers.getCheapToursMiddleware, toursControllers.getReq);

tour.route('/tours-stats').get(toursControllers.toursStats);
tour.route('/monthly-plans/:year').get(toursControllers.monthlyTours);

tour.route('/').get(authController.protect, toursControllers.getReq);

tour
  .route('/')
  .get(toursControllers.getReq)
  // .post(toursControllers.checkBody, toursControllers.postReq); //chaining multiple middlware func , no need of checkbody middlwre our mongoose model will takecare
  .post(toursControllers.postReq); //chaining multiple middlware func

// no need for this check id this done by model validation
// tour.param('id', toursControllers.checkId);

tour
  .route('/:id')
  .get(toursControllers.getSingleReq)
  .patch(toursControllers.patchReq)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursControllers.deleteReq,
  );

module.exports = tour;
