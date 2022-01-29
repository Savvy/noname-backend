const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  bio: {
    type: String,
  },
  avatar: {
    type: String,
  },
  gender: {
    type: String,
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
