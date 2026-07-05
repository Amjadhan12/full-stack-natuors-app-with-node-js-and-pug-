const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/toursModel');
const User = require('./../../models/userModle');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './../../config.env' });

mongoose
  .connect(process.env.DATABASE_local, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));
console.log(process.env.DATABASE_local);
//REAd json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

//import DATA into db
const importDATA = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews, { validateBeforeSave: false });
    console.log('data successfuly loded.. ');
  } catch (err) {
    console.log(err);
  }
};
//DELETE All DATA from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('data successfuly deleted.. ');
  } catch (err) {
    console.log('error', err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importDATA();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
