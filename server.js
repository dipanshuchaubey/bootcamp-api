const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');
const morgan = require('morgan');
const hpp = require('hpp');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParse = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

// Load env file
dotenv.config({ path: './config/config.env' });

// Bring in routers files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Connect to database
connectDB();

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParse());

// Dev Logger using morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File upload Middleware
app.use(fileUpload());

// Protect Middleware
app.use(helmet());

// Sanitize mongo queries
app.use(mongoSanitize());

// Enable CORS
app.use(cors());

// Protect against http param pollution
app.use(hpp());

// Protect from XSS
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});

app.use(limiter);

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Mount error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// For Unhandeled Rejection of promise
process.on('unhandledRejection', (err, promise) => {
  // @ts-ignore
  console.log(`Error : ${err.message}`.red);
  server.close(() => process.exit(1));
});
