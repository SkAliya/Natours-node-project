// commeted 1's no need
// const fs = require('fs');
const Tour = require('./../models/toursModel');

// no need
// let toursData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// TOURS HANDLERS

exports.getReq = (req, res) => {
  res.status(200).send({
    status: 'success',
    requestedAt: req.requestTime,
    // results: toursData.length,
    // data: {
    //   tours: toursData,
    // },
  });
};

// exports.postReq =  (req, res) => {

//   res.status(201).json({
//     status: 'success',
//     // data: {
//     //   tours: toursData,
//     // },
//   });
// };
exports.postReq = async (req, res) => {
  try {
    // 1 - way of creating doc
    // const newTour = new Tour({ data });
    // newTour.save();

    // 2 - way of creating doc using the create() method dirtly on model which retuns the promise catch the errs using trycatch if promis rejected

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err, //or message:"incomplete data" dont do this way of setting err mss in real world apps, we will learn how err handler later for expermting u can use mssg ur own
    });
  }
};

exports.getSingleReq = (req, res) => {
  res.status(200).send({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
};

exports.patchReq = (req, res) => {
  res.status(200).send({
    status: 'success',
    data: {
      tour: '<Updated> tour data',
    },
  });
};

exports.deleteReq = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: 'successfully deleted',
    data: null,
  });
};

// this is no need for now becuae thsi is exm for how middleare works ,he checking id of each doc is donw by validation in model of tour
// exports.checkId = (req, res, next, val) => {
//   console.log(`tour id is : ${val}`);

//   if (Number(val) > toursData.length) {
//     return res.status(404).send({
//       status: 'fail',
//       message: 'Tour not found: Invalid ID',
//     });
//   }

//   next();
// };

// this also no need
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'bad request',
//     });
//   }
//   next();
// };
