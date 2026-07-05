const express = require('express');
const ReviewController = require('./../controller/reviewController');
const authControler = require('./../controller/authControler');

const router = express.Router({
  mergeParams: true,
});

router.use(authControler.protect);

router
  .route('/')
  .post(
    authControler.restricTo('user'),
    ReviewController.setTourUserIds,
    ReviewController.ctreateReview,
  )
  .get(ReviewController.getAllReview);
router
  .route('/:id')
  .get(ReviewController.getReview)
  .delete(
    authControler.restricTo('admin', 'user'),
    ReviewController.deleteReview,
  )
  .patch(
    authControler.restricTo('admin', 'user'),
    ReviewController.updateReview,
  );

module.exports = router;
