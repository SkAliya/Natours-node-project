const express = require('express');
const toursControllers = require('./../controllers/toursControllers');
const authController = require('./../controllers/authController');

const reviewsRouter = require('./reviewsRoutes');

const tour = express.Router();

// Nested  routes using express
tour.use('/:tourid/reviews', reviewsRouter);

tour
  .route('/top-5-cheap-tours')
  .get(toursControllers.getCheapToursMiddleware, toursControllers.getReq);

tour.route('/tours-stats').get(toursControllers.toursStats);
tour
  .route('/monthly-plans/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    toursControllers.monthlyTours,
  );

tour
  .route('/')
  .get(toursControllers.getReq)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursControllers.postReq,
  );

tour
  .route('/:id')
  .get(toursControllers.getSingleReq)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursControllers.patchReq,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursControllers.deleteReq,
  );

module.exports = tour;
