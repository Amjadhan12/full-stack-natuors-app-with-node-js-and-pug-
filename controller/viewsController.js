const Tour=require('../models/toursModel');
const User=require('../models/userModle')
const AppError=require('../utils/appError');
const catchAsync=require('../utils/catchAssync');

exports.getoverview=catchAsync(async(req,res) =>
{
  // 1.) Get Tours data from collection
  const tours=await Tour.find();

  //2.)build template
  //3.) render that template using tour data from 1)
  res.status(200).render('overview',{
    title: 'All Tours',
    tours
  })
})

exports.gettours=catchAsync(async(req,res,next) =>
{
  //1.) Get the data for the request tour (includeing reviews and guides)
  const tour=await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields:'review rating user'
  })

  if(!tour)
  {
    return next(new AppError('there is no tour with that name.',404))
  }
  //2.) Build template
  //3.) Render template using data from 1)
  res.status(200).render('tour',{
    title: `${tour.name} Tour`,
    tour
  })
})

exports.getLoginForm=(req,res) =>
{
  res.status(200).render('login',{
    title:'log into your account '
  })
}
exports.getAccount=(req,res) =>
{
    res.status(200).render('account',{
    title:'Your account '
  })
}

exports.updateUserData=catchAsync(async(req,res,next)=>{
  console.log('Udating User',req.body);

  const updateUser=await User.findByIdAndUpdate(req.user.id,{
    name: req.body.name,
    email:req.body.email
  },
  {
    new: true,
    runValidators:true
  });
    res.status(200).render('account',{
      title: 'Your account',
      user:updateUser,

  })
})
