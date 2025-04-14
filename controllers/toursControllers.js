const AppGlobalErrorClass = require('../utils/appGlobalError');
const Tour = require('./../models/toursModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

// MIDDLEWARE

exports.getCheapToursMiddleware = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// TOURS HANDLERS

exports.getReq = catchAsync(async (req, res, next) => {
  // BUILDING QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();

  // EXECUTING QUERY
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).send({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getSingleReq = catchAsync(async (req, res, next) => {
  // const tour = await Tour.findById(req.params.id);
  // const tour = await Tour.findById(req.params.id).populate('guides');

  if (!tour) {
    return next(new AppGlobalErrorClass(404, 'No tour found with that ID'));
  }

  res.status(200).send({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.postReq = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  if (!newTour) {
    return next(new AppGlobalErrorClass(404, 'No tour found with that ID'));
  }

  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    },
  });
});

exports.patchReq = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppGlobalErrorClass(404, 'No tour found with that ID'));
  }
  res.status(200).send({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteReq = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppGlobalErrorClass(404, 'No tour found with that ID'));
  }
  res.status(204).json({
    status: 'success',
    message: 'successfully deleted',
    data: null,
  });
});

exports.toursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        avePrice: { $avg: '$price' },
        aveRating: { $avg: '$ratingsAverage' },
        numRatings: { $sum: '$ratingsQuantity' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avePrice: 1 } },
  ]);
  res.status(200).json({
    status: 'success',
    stats,
  });
});

exports.monthlyTours = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);

  const plans = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01 `),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursMon: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } }, //adds the month fiedl
    { $project: { _id: 0 } }, //it hides the id field
    { $sort: { numToursMon: -1 } },
    { $limit: 12 }, //or {$limit:6}
  ]);
  res.status(200).json({
    status: 'success',
    data: { plans },
  });
});
