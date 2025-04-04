const fs = require('fs');

let toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// TOURS HANDLERS

exports.getReq = (req, res) => {
  res.status(200).send({
    status: 'success',
    requestedAt: req.requestTime,
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
};

exports.postReq = (req, res) => {
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  toursData.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: toursData,
        },
      });
    }
  );
};

exports.getSingleReq = (req, res) => {
  const id = req.params.id;
  console.log(id);
  const tour = toursData.find((tour) => tour.id === Number(id));

  res.status(200).send({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.patchReq = (req, res) => {
  const id = req.params.id;

  const updatedData = toursData.map((tour) => {
    if (tour.id === Number(id)) {
      return { ...tour, ...req.body };
    } else return tour;
  });

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updatedData),
    (err) => {
      res.status(200).send({
        status: 'success',
      });
    }
  );
};

exports.deleteReq = (req, res) => {
  const id = req.params.id;
  console.log(id);

  const updatedData = toursData.filter((tour) => tour.id !== Number(id));

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updatedData),
    (err) => {
      res.status(204).json({
        status: 'success',
        message: 'successfully deleted',
        data: null,
      });
    }
  );
};

exports.checkId = (req, res, next, val) => {
  console.log(`tour id is : ${val}`);

  if (Number(val) > toursData.length) {
    return res.status(404).send({
      status: 'fail',
      message: 'Tour not found: Invalid ID',
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'bad request',
    });
  }
  next();
};
