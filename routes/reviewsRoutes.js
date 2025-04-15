const express = require('express');
const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');

const review = express.Router();

// GETTING REVIEWS & CREATING NEW

// review.route('/:id').get(reviewsController.getAllReviews);
review
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewsController.createReview,
  );

module.exports = review;
