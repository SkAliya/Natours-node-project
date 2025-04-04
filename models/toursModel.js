const mongoose = require('mongoose');

// /////////////////////////////////doc new tour creating using mongoose model & schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 5.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

// ONLY FOR TESTING PURPOSE WE CREATE NEW DOC FORM MODEL FROM SCHMES
// const testTour = new Tour({
//   name: 'Test1',
//   price: 666,
// });

// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log('Error 💥', err));

module.exports = Tour;
