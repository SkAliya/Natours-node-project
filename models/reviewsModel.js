const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Rewiew cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour'],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user'],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// reviewsSchema.pre(/^find/, function (next) {
//   console.log(this);
//   this.find().select('-__v');
//   next();
// });

reviewsSchema.pre(/^find/, function (next) {
  // this is my exprmt
  // this.populate({
  //   path: 'tour',
  //   select: '-__v',
  // }).populate({
  //   path: 'user',
  //   select: '-__v',
  // });
  // we dont want to showup others , users(reviwers) data on reviews of tours who revied this like email of urs other sensitive data of reviewer ok so only name of the reviewr is enough
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  // here we not populaitng the tour data in reviews array becuase when u req a tour single then this reviews array contains the same tour  data we r chaining populate method makes slow so make sure if u dont want some type data then u can skip nd use the id simple as before when we not populate anything ok
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewsSchema);

module.exports = Review;
