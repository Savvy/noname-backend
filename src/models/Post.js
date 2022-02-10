const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  content: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  thread: {
    type: mongoose.Schema.ObjectId,
    ref: 'Thread',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', ModelSchema);
