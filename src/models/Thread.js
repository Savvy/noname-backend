const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  title: String,
  content: String,
  pinned: Boolean,
  slug: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  forum: {
    type: mongoose.Schema.ObjectId,
    ref: 'Forum',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Thread', ModelSchema);
