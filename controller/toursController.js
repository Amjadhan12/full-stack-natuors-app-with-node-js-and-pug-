const Tour = require('./../models/toursModel');
const multer=require('multer')
const CatchAsync = require('./../utils/catchAssync');
const AppError = require('../utils/appError');
const factory=require('./handlerFactory');
const catchAssync=require('./../utils/catchAssync');
const sharp=require('sharp')




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

exports.uplodToursImage=upload.fields([
  {name: 'imageCover',maxCount: 1},
  {name:'images',maxCount:3}
])

// upload.single('image') req.file
// upload.array('images', 5)

exports.resizetourImages=catchAssync(async(req,res,next) =>
{
  console.log(req.files)

  if(!req.files.imageCover||!req.files.images) return next();

  //1.) Cour image
  req.body.imageCover=`tour-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/img/tours/${req.body.imageCover}`);

  //2.) images
  req.body.images=[];

  await Promise.all( req.files.images.map(async (file,i) =>
  {
    const filename=`tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`;
     await sharp(file.buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({quality: 90})
      .toFile(`public/img/tours/${filename}`);

    req.body.images.push(filename)

  }))
  next();
})


///////////////////////////////////////
exports.aliasToptour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverrage,summary,difficulty';
  next();
};
//2)route handleer
exports.getAlltours = factory.getAll(Tour);
exports.getTours = factory.getOne(Tour, {path:['guides','reviews']});
exports.createTours = factory.CreateOne(Tour);
exports.updateTours = factory.updateOne(Tour);
exports.deleteTours = factory.deleteOne(Tour);
///////////////////////////////////////
///agrigation pip line

exports.getToursStats = CatchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: {
          $sum: 1,
        },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgprice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgprice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'succes',
    data: {
      stats,
    },
  });
  next();
});

exports.getMonthlyplan = CatchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDate' },
    {
      $match: {
        startDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDate' },
        numtourstarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numtourstarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'succes',
    data: {
      plan,
    },
  });
  next();
});

exports.getToursWithin = CatchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const latitude = parseFloat(lat);
  const langidute = parseFloat(lng);
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!latitude || !langidute) {
    next(
      new AppError(
        'please provide langitude and latitude in the format of lat,lng',
        400,
      ),
    );
  }

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[langidute, latitude], radius] },
    },
  });

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistense = CatchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'please provide langitude and latitude in the format of lat,lng',
        400,
      ),
    );
  }

  const distances = await Tour.aggregate(
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
        key: 'startLocation',
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  );
  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
