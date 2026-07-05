const stripe=require('stripe')(process.env.SECRET_STRIPE)
const Tour=require('./../models/toursModel');
const CatchAsync = require('./../utils/catchAssync');
const AppError = require('../utils/appError');
const factory=require('./handlerFactory');
const catchAssync=require('./../utils/catchAssync');


exports.getCheckOutSession=catchAssync(async(req,res,next) =>
{
  //1.) get the currently booked tour
  const tour=await Tour.findById(req.params.tourId)
  //2.) Create checkOut session
const session=await stripe.checkout.sessions.create({
    payment_method_types: ['cards'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price*100,
        currency: 'usd',
        quantity:1
      }
    ]
  })
  //3.) Create session as ressponse
  res.status(200).json({
    status: 'success',
    session
  })
})
