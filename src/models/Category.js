const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  name: String,
  slug: String,
  description: String,
  hidden: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Category', ModelSchema);
