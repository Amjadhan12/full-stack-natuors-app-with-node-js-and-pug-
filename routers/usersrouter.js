const express=require('express');
const userController = require('./../controller/userController');
const authControler = require('./../controller/authControler');
const Review=require('../models/reviewModel');




const router = express.Router();

router.post('/signup', authControler.signup);
router.post('/login', authControler.login);
router.get('/logout', authControler.logout);
router.post('/forgotPassword', authControler.forgotPassword);
router.patch('/resetPassword/:token', authControler.resetPassword);

//protect all route after this middlewar
router.use(authControler.protect);

router.patch('/updateMyPassword', authControler.updatePassword);
router.get('/me', userController.getMe, userController.getuser);
router.patch('/updateMe',userController.uploadUserphoto,userController.resizeUserPhoto ,userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authControler.restricTo('admin'));
router
  .route('/')
  .get(userController.getAllusers)
  .post(userController.createuser);
router
  .route('/:id')
  .get(userController.getuser)
  .patch(userController.updateuser)
  .delete(userController.deleteuser);

module.exports = router;
