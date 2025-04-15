const AppGlobalErrorClass = require('../utils/appGlobalError');
const Tour = require('./../models/toursModel');
const User = require('../models/userModel');
const catchAsyc = require('./../utils/catchAsync');
const Review = require('../models/reviewsModel');

exports.getAllReviews = catchAsyc(async (req, res, next) => {
  // const tour = await Tour.findById(req.params.id);
  // if (!tour)
  //   return next(new AppGlobalErrorClass(404, 'No tour found with that ID'));

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     reviews: tour.reviews,
  //   },
  // });
  const reviews = await Review.find();

  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

// exports.createReview = catchAsyc(async (req, res, next) => {
//   const newReview = await Review.create(req.body);

//   if (!newReview)
//     return next(new AppGlobalErrorClass(404, 'No review found with that ID'));

//   res.status(201).json({
//     status: 'Success',
//     data: {
//       Reviews: newReview,
//     },
//   });
// });
exports.createReview = catchAsyc(async (req, res, next) => {
  if (!req.body.tourid) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  if (!newReview)
    return next(new AppGlobalErrorClass(404, 'No review found with that ID'));

  res.status(201).json({
    status: 'Success',
    data: {
      Reviews: newReview,
    },
  });
});
