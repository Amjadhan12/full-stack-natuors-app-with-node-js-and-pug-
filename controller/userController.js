const User=require('./../models/userModle');
const multer=require('multer')
const catchAsync=require('./../utils/catchAssync');
const sharp=require('sharp')
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// const multerStorage=multer.diskStorage({
//   description: (req,file,cb) =>
//   {
//     cb(null,'public/img/users')
//   },
//   filename: (req,file,cb) =>
//   {
//     const ext=file.minetype.split('/')[1]
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })

const multerStorage=multer.memoryStorage();

const multerFilter=(req,file,cb) =>
{
  if(file.mimetype.startsWith('image'))
  {
    cb(null,true)
  }
  else
  {
    cb(new AppError('not an image please upload only images',400),false);
  }
}

const upload=multer({
  storage: multerStorage,
  fileFilter:multerFilter
});

exports.uploadUserphoto=upload.single('photo');

exports.resizeUserPhoto=catchAsync(async(req,res,next) =>
{
  if(!req.file) return next();

  req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`;

await sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/img/users/${req.file.filename}`)
  next();
})

const filterObj = (obj, ...alowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (alowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
/////////////////////////////////////////////
exports.updateMe=catchAsync(async (req,res,next) =>
{
  console.log(req.file);
  console.log(req.body);
  //1) create eeror if the user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this rout is not for password update, please use /updateMypassword ',
        400,
      ),
    );
  }
  //2) Filter out unwanted fields naem there not alwod to be update
  const filterdBody=filterObj(req.body,'name','email');
  if(req.file) filterdBody.photo=req.file.filename;
  //3) update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
/////////////////////////
exports.createuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined ! please use sing up instead .. ',
  });
};
///////////////////////////////
exports.getAllusers = factory.getAll(User);
exports.getuser = factory.getOne(User);
exports.updateuser = factory.updateOne(User);
exports.deleteuser = factory.deleteOne(User);
