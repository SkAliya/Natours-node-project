const mongoose = require('mongoose');

// /////////////////////////////////doc new tour creating using mongoose model & schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have name'],
    unique: true,
  },
  duration: {
    type: String,
    required: [true, 'A tour must have description'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, 'A tour must have summary'],
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    // latest mongoose method if timestamps:true instead of manually using date.now
  },
  description: {
    type: String,
    trim: true,
  },
  rating: Number,
  price: {
    type: Number,
    default: 200,
    required: [true, 'A tour must have a price'],
  },
  startDates: [Date],
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
