const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

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
  active: {
    type: Boolean,
    default: false,
  },
  banned: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

ModelSchema.methods.setPassword = function(password) {
  this.password = bcrypt.hashSync(password, 10);
};

ModelSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

ModelSchema.plugin(uniqueValidator, {message: '{PATH} must be unique'});

module.exports = mongoose.model('User', ModelSchema);
