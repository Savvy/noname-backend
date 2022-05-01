const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  threadId: Number,
  title: String,
  pinned: Boolean,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  forum: {
    type: mongoose.Schema.ObjectId,
    ref: 'Forum',
  },
  posts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
  }],
}, {
  timestamps: true,
});

ModelSchema.plugin(AutoIncrement, {inc_field: 'threadId'});

module.exports = mongoose.model('Thread', ModelSchema);
