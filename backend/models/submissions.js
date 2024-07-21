const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prob_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['accepted', 'rejected', 'pending']
  },
  points: {
    type: Number,
    required: true
  },
  sub_time: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Submission', submissionSchema);

