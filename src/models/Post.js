const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  postId: Number,
  content: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  thread: {
    type: mongoose.Schema.ObjectId,
    ref: 'Thread',
  },
}, {
  timestamps: true,
});

ModelSchema.plugin(AutoIncrement, {inc_field: 'postId'});

module.exports = mongoose.model('Post', ModelSchema);
