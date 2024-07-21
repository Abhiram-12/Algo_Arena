const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problems_id_solved: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    default: [] 
  }],
  contest_participated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    default: []
  }],
  contest_stats: [{
    contest_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required:true
    },
    problems_solved: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      default: []
    }],
    ranking: {
      type: Number,
    },
    points: {
      type: Number,
      default: 0
    }
  }]
});

module.exports= mongoose.model('UserStats', userStatsSchema);

