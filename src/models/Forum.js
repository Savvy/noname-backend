const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
  },
  name: String,
  slug: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Forum', ModelSchema);
