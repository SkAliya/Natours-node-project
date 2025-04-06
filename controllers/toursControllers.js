const Tour = require('./../models/toursModel');

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

    // 1A) FILTERING  [DURATION=5]
    let queryObj = { ...req.query };
    const excludeQueries = ['sort', 'page', 'limit', 'fields'];
    excludeQueries.forEach((el) => delete queryObj[el]);

    // 1B) ADVANCED FILTERING [PRICE[LT]=999]
    // LT/GT/LTE/GTE
    // { duration: { $lt: '5' } };

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lt|gt|lte|gte)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING
    // sort=price(Asending) /srt=-price(desending)
    // sort=price,ratingsAverage => querystr {sort :'-price duration'}  compass =>{ratingsAverage:-1,price:1}
    if (req.query.sort) {
      let sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) FIELDS

    if (req.query.fields) {
      let fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v').select('-name');
    }

    // PAGINATION
    // page=2&limit=5
    // page 1 1-5 ,page 2 6-10 , page 3 11-15 ..

    const page = Number(req.query.page) || 1;
    const limit = req.query.limit * 1 || 10; //converting to number by multi 1
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numOfTours = await Tour.countDocuments();
      if (skip >= numOfTours) throw new Error('This page does not exits!');
    }
    // EXECUTING QUERY
    const tours = await query;

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
