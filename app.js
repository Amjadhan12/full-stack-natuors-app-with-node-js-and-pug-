const path = require('path');
const express = require('express');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorControler');
const morgan = require('morgan');
const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const mongosSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp=require('hpp');
const cookieparser=require('cookie-parser')

const tourRouter = require('./routers/tourrouter');
const userRouter = require('./routers/usersrouter');
const ReviewRouter=require('./routers/ReviewRouter');
const viewRouter=require('./routers/viewRouter');
// const bookingRouter=require('./routers/bookingRouter');
////////////////////////////////
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
///////////////////////////////
//1 .)Global madelware
//serving static fields
app.use(express.static(path.join(__dirname, 'public')));
//security http header
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "ws://127.0.0.1:*", "ws://localhost:*"],
      imgSrc: ["'self'", "data:", "https:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

//devolopment logingin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limit request from same api
const limiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from  this Ip, please try agin in hour!',
});
app.use('/api', limiter);

//body parser reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended:true,limit:'10kb'}))
app.use(cookieparser())

//Data sanitization No sql qeury injection
app.use(mongosSanitize());
//Data sanitization No sql qeury XSS
app.use(xss());
//pvevent prameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'maxGroupSize',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies)
  next();
});

//3) router

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', ReviewRouter);
//app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find the ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
