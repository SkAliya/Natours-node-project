const mongoose = require('mongoose');
const slugify = require('slugify');

// /////////////////////////////////doc new tour creating using mongoose model & schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// virtual properties:
tourSchema.virtual('durationWeeks').get(function () {
  return Math.floor(this.duration / 7);
});

//DOCUMENT MIDDLEWARES OF IN MONGOOSE

// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

/////////////we can so many pre middlwraes as we sadi
// tourSchema.pre('save', function (next) {
//   console.log('i will run before saved lol');
//   next();
// });

// //////////// post middlwre
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(
    `query takes time to create find ${Date.now() - this.start} milliseconds `,
  );
  console.log(docs);
  next();
});

//  AGGREGATE MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
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
