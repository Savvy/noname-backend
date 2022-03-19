const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  bio: {
    type: String,
  },
  avatarType: {
    type: String,
    enum: ['Gravatar', 'Custom'],
    default: 'Gravatar',
  },
  avatar: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    default: 'Prefer not to say',
  },
  socials: {
    twitter: String,
    youtube: String,
    instagram: String,
    tiktok: String,
    website: String,
    facebook: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('UserDetails', ModelSchema);
