const Tour = require('./../models/toursModel');
const APIFeatures = require('./../utils/apiFeatures');

// MIDDLEWARE

exports.getCheapToursMiddleware = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// TOURS HANDLERS

exports.getReq = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getSingleReq = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // or const tour = await Tour.findOne({_id:req.params.id});
    // both r same findbyid nd findon1 mongoose makes easy for use with findbyid in back it does the work as findOne  without passing the object just pass the direct id itself

    res.status(200).send({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.postReq = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err, //or message:"incomplete data" dont do this way of setting err mss in real world apps, we will learn how err handler later for expermting u can use mssg ur own
    });
  }
};

exports.patchReq = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).send({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteReq = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'successfully deleted',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.toursStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.monthlyTours = async (req, res) => {
  const year = Number(req.params.year);
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
