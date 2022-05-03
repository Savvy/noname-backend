const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  thread: {
    type: mongoose.Schema.ObjectId,
    ref: 'Thread',
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bookmark', ModelSchema);
