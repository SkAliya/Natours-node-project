const Tour = require('./../models/toursModel');

// TOURS HANDLERS

exports.getReq = async (req, res) => {
  try {
    // BUILDING QUERY
    const queryObj = { ...req.query };
    // console.log(queryObj);
    const { sort, fields, limit, page, ...remainingfields } = queryObj;
    // console.log(remainingfields);

    // another way of filtering is using mongoose methods where equals
    // const query = Tour.find()
    //   .where('difficulty')
    //   .equals('easy')
    //   .where('duration')
    //   .equals(5);

    // another old jonas way is
    // const extraFields = ['page', 'sort', 'limit', 'fields'];
    // extraFields.forEach((field) => delete queryObj[field]);
    // const query = Tour.find(queryObj);

    // const tours = await Tour.find();

    // res.status(200).send({
    //   status: 'success',
    //   requestedAt: req.requestTime,
    //   results: tours.length,
    //   data: {
    //     tours,
    //   },
    // });

    const query = Tour.find(remainingfields);

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
