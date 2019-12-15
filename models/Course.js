const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add course duration']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add tuition fee for the course']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add minimum skills'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average cost of bootcamp using agrigation
CourseSchema.statics.calculateAverageCost = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);

  const average = Math.ceil(obj[0].averageCost);

  await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
    averageCost: average
  });
};

// Calculate average cost after saving a course
CourseSchema.post('save', function() {
  this.constructor.calculateAverageCost(this.bootcamp);
});

// Calculate average cost before deleting a course
CourseSchema.pre('remove', function() {
  this.constructor.calculateAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
