const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  content: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  children: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Comment',
    autopopulate: true,
  }],
  like: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    autopopulate: true,
  }],
  reply: {
    type: Boolean,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Comment', ModelSchema);
