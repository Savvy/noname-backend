const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  name: String,
  slug: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Category', ModelSchema);
