const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'dislike'],
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only have one reaction per post
ReactionSchema.index({ user: 1, post: 1 }, { unique: true });

const Reaction = mongoose.model('Reaction', ReactionSchema);

module.exports = Reaction;