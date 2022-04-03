const {User: Model} = require('../models');
module.exports = async function(req, res, next) {
  if (req.user) {
    // TODO: Update online users
    await Model.findByIdAndUpdate(req.user._id, {
      lastSeen: new Date(),
    });
  }
  next();
};
