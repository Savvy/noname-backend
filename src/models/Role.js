const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  text_color: {
    type: String,
    required: false,
  },
  badge_color: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
  permissions: [{
    type: String,
  }],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Role', ModelSchema);
