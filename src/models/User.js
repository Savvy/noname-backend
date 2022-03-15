const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const gravatar = require('gravatar');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
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
    unique: true,
  },
  banned: {
    type: Boolean,
    default: false,
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
 * By default accounts are set to pending, this method is used to
 * generate a confirmation token to activate the user account.
 */
ModelSchema.methods.generateToken = function() {
  this.confirmationCode = crypto.randomBytes(16).toString('hex');
};

ModelSchema.post('find', function(docs) {
  docs.forEach((doc) => {
    doc.gravatar = gravatar.url(doc.email,
        {protocol: 'https', s: '130', d: 'retro'});
  });
});

ModelSchema.post('findOne', function(doc) {
  doc.gravatar = gravatar.url(doc.email,
      {protocol: 'https', s: '130', d: 'https://i.imgur.com/45vM6qK.jpg'});
  console.log(doc);
});

ModelSchema.plugin(require('mongoose-unique-validator'),
    {message: '{PATH} must be unique'});

module.exports = mongoose.model('User', ModelSchema);
