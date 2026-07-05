const express=require("express");
const viewsController=require('../controller/viewsController')
const authcontroller=require('../controller/authControler')
const router=express.Router();



router.get('/',authcontroller.isLogedin,viewsController.getoverview)
router.get('/tour/:slug',authcontroller.isLogedin,viewsController.gettours)
router.get('/login',authcontroller.isLogedin,viewsController.getLoginForm)
router.get('/Me',authcontroller.protect,viewsController.getAccount)

router.post('/submit-user-data',authcontroller.protect,viewsController.updateUserData)




module.exports=router;
