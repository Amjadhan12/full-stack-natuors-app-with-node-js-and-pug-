const express = require('express');
const bookingcontroller= require('./../controller/bookingcontroller');
const authControler = require('./../controller/authControler');

const router = express.Router();

//router.get('/checkout-session/:toursId',authControler.protect,bookingcontroller.getCheckOutSession)

module.exports = router;
