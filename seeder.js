const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Load DB models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// Conenct to mongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read json
const bootcamps = JSON.parse(
  fs.readFileSync('./_data/bootcamps.json', 'utf-8')
);

const courses = JSON.parse(fs.readFileSync('./_data/courses.json', 'utf-8'));

const users = JSON.parse(fs.readFileSync('./_data/users.json', 'utf-8'));

const reviews = JSON.parse(fs.readFileSync('./_data/reviews.json', 'utf-8'));

// Import Data
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);

    console.log('Data Imported Successfully..'.green.inverse);

    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data Removed Successfully..'.red.inverse);

    process.exit();
  } catch (error) {
    console.error(error);
  }
};

/**
 * @desc argv[2] refers to second argument passed after
 *       node from the console.
 */
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-r') {
  deleteData();
} else {
  console.log('Method not available');
  process.exit();
}
