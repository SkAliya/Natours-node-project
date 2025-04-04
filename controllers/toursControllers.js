const Tour = require('./../models/toursModel');

// TOURS HANDLERS

exports.getReq = async (req, res) => {
  try {
    const tours = await Tour.find();

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
