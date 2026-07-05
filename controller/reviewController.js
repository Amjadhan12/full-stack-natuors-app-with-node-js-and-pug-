const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  //Alows nested routes
  if (!req.body.Tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.ctreateReview = factory.CreateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
