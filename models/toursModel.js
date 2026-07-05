const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModle');
const Review = require('./reviewModel');
// const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name '],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equle then 40 charachter'],
      minlength: [10, 'A tour name must have more or equle then 10 charachter'],
      // validate: [validator.isAlpha, 'tour name must only contain character'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a price '],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupsize '],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a Difficulty '],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty must ethire: easy medium difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'The ratig must above 1.0'],
      max: [5, 'The ratig must less 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price '],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'discount price ({VALUE}) should be below the reguler price ',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have discription'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: 'A Tour must have couver image',
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secreatTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GoeJson
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationweek').get(function () {
  return this.duration / 7;
});

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
// document malware : runs befor .save() .creat()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});



tourSchema.pre('save', function (next) {
  console.log('will save docoment.......');
  next();
});

tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secreatTour: { $ne: true } });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds..`);
  next();
});

//agreagate madleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secreatTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
