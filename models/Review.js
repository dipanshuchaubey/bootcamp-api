const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    minlength: 10,
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
    minlength: 10,
    maxlength: 255
  },
  rating: {
    type: Number,
    required: [true, 'Please add rating'],
    min: 1,
    max: 10
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
