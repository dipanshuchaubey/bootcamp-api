const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Bring in routers files
const bootcamps = require('./routes/bootcamps');

// Load env file
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body Parser
app.use(express.json());

// Dev Logger using morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Router
app.use('/api/v1/bootcamps', bootcamps);

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
