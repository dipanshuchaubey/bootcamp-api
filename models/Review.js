const mongoose = require('mongoose');
const Bootcamp = require('../models/Bootcamp');

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

// Calculate average rating of course
ReviewSchema.statics.calculateAverageRating = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  const averageRating = Math.ceil(obj[0].averageRating);

  // Save avergae cost into bootcamp
  await Bootcamp.findByIdAndUpdate(
    bootcampId,
    { averageRating },
    { new: true, runValidators: true }
  );
};

ReviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.bootcamp);
});

ReviewSchema.pre('remove', function() {
  this.constructor.calculateAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
