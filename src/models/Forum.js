const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
  },
  name: String,
  slug: String,
  recent_thread: {
    type: mongoose.Schema.ObjectId,
    ref: 'Thread',
  },
  parent: {
    type: mongoose.Schema.ObjectId,
  },
  redirect: {
    type: Boolean,
    required: true,
    default: false,
  },
  redirect_url: {
    type: String,
  },
  icon: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Forum', ModelSchema);
