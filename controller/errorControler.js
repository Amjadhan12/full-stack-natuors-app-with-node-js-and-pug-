const AppError = require('./../utils/appError');
const handleCastDB = (err) => {
  const message = `Invalid ${err.path} ${err.value} .... `;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate fields values : ${value} please use another values`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. please log in again!', 401);
const handleExpiredToken = () =>
  new AppError('Your token is expired please log in again', 401);

const sendErrordev=(err,req,res) =>
{
  //Api
  if(req.originalUrl.startsWith('/api'))
  {
  return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
   console.error('Error 💥',err);
  return res.status(err.statusCode).render('error',{
    //Rendered website
      title: 'Something went wrong',
      msg:err.message
    })
};
const sendErrorprod=(err,req,res) =>
{
  // a api
  if(req.originalUrl.startsWith('/api'))
  {
    // A opritional trasted error send message to client
    if(err.isOperational)
    {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //log err
    // B programing and other unknown err don't leak error detaill
    console.error('Error 💥',err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong.....',
      });
  }
  // B rendered website
  //A opritional trust error send message to client
    if(err.isOperational)
    {
      return res.status(err.statusCode).render('error',{
        title: "Something went wrong!",
        msg: err.message,
      });
  }
    //log err
  // B programing and other unknown err don't leak error detaill
  console.error('Error 💥',err);
  //2.) send generic message
    return res.status(err.statusCode).render('error',{
     //Rendered website
      title: 'Something went wrong',
      msg:"please try again later"
    })
 }

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrordev(err,req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error={...err};
    error.message=err.message

    if (error.name === 'CastError') error = handleCastDB(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error.name === 'ValidationError')  error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleExpiredToken();
    sendErrorprod(error, req,res);
  }
  next();
};
