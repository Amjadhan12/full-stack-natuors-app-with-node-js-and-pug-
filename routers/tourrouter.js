const express = require('express');
const toursController = require('./../controller/toursController');
const authcontroler = require('./../controller/authControler');
const router = express.Router();
const reviewrouter = require('./ReviewRouter');

router.use('/:tourId/review', reviewrouter);

router
  .route('/top-5-cheap')
  .get(toursController.aliasToptour, toursController.getAlltours);

router.route('/tour-stats').get(toursController.getToursStats);
router
  .route('/monthly-plan/:year')
  .get(
    authcontroler.protect,
    authcontroler.restricTo('admin', 'lead-guide', 'guide'),
    toursController.getMonthlyplan,
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(toursController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(toursController.getDistense);

router
  .route('/')
  .get(toursController.getAlltours)
  .post(
    authcontroler.protect,
    authcontroler.restricTo('admin','lead-guide'),
    toursController.uplodToursImage,
    toursController.resizetourImages,
    toursController.createTours,
  );
router
  .route('/:id')
  .get(toursController.getTours)
  .patch(
    authcontroler.protect,
    authcontroler.restricTo('admin', 'lead-guide'),
    toursController.updateTours,
  )
  .delete(
    authcontroler.protect,
    authcontroler.restricTo('admin', 'lead-guide'),
    toursController.deleteTours,
  );

module.exports = router;
