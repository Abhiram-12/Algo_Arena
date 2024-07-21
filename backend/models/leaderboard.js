const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  contest_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true,
    unique: true
  },
  topPerformers: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    solvedProblemsCount: {
      type: Number,
      default: 0
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    lastSubmissionTime: {
      type: Date,
      default: null
    },
    solvedProblems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }]
  }]
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
