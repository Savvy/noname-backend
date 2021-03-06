const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/^[a-zA-Z0-9-\s]+$/, 'is invalid'],
    index: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
  },
  password: String,
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending',
  },
  confirmationCode: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  banned: {
    type: Boolean,
    default: false,
  },
  details: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserDetails',
  },
  role: {
    type: mongoose.Schema.ObjectId,
    ref: 'Role',
  },
  isStaff: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: new Date(),
  },
  socials: {
    twitter: {
      id: {
        type: String,
        required: false,
      },
      username: {
        type: String,
        requireed: false,
      },
    },
    discord: {
      id: {
        type: String,
        required: false,
      },
      username: {
        type: String,
        requireed: false,
      },
      discriminator: {
        type: String,
        required: false,
      },
    },
  },
}, {
  timestamps: true,
});

/**
 * Hash and set user account password.
 * @param {String} password
 */
ModelSchema.methods.setPassword = function(password) {
  this.password = bcrypt.hashSync(password, 10);
};

/**
 * Returns a boolean indicating if the password matches the hash password.
 * @param {String} password
 * @return {Boolean}
 */
ModelSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * By default accounts are set to pending, this function is used to
 * generate a confirmation token to activate the user account.
 */
ModelSchema.methods.generateConfirmation = function() {
  this.confirmationCode = crypto.randomBytes(16).toString('hex');
};

/**
 * This function is used to generate a password reset token.
 */
ModelSchema.methods.generateReset = function() {
  this.resetToken = crypto.randomBytes(16).toString('hex');
};
/*
ModelSchema.plugin(require('mongoose-unique-validator'),
    {message: '{PATH} must be unique'}); */

module.exports = mongoose.model('User', ModelSchema);
