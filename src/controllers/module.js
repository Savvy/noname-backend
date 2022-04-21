const {User, Thread, Post} = require('../models');
const settings = require('../data/settings.json');

const controller = module.exports;

controller.onlineUsers = async function(req, res, next) {
  const users = await User.find({
    lastSeen: {
      $gt: new Date(Date.now() - (5 * 60 * 1000)),
    },
  }).select('username lastSeen').populate({
    path: 'details',
    select: 'avatarType avatar',
  });
  res.status(200).json({
    success: true,
    users: users,
  });
};

controller.recentUsers = async function(req, res, next) {
  const users = await User.find({}).sort({
    createdAt: -1,
  }).select('username').populate({
    path: 'details',
    select: 'avatarType avatar',
  }).limit(settings.recentUsersLimit);
  res.status(200).json({
    success: true,
    users: users,
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
