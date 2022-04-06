const {User, Thread, Post} = require('../models');

const controller = module.exports;

controller.onlineUsers = async function(req, res, next) {
  res.status(200).json({
  });
};

controller.statistics = async function(req, res, next) {
  res.status(200).json({
    success: true,
    memberCount: await User.countDocuments({}),
    threadCount: await Thread.countDocuments({}),
    postCount: await Post.countDocuments({}),
    latestUser: await User.findOne({}, 'username', {
      sort: {'createdAt': -1},
    }),
  });
};

controller.shareSite = function() {
  res.status(200).json({
    success: true,

  });
};
