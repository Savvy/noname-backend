const {User: UserModel, Thread: ThreadModel} = require('../models');
const controller = module.exports;

controller.statistics = async function(req, res, next) {
  res.status(200).json({
    success: true,
    memberCount: await UserModel.countDocuments({}),
    threadCount: await ThreadModel.countDocuments({}),
    postCount: 0, // PostModel.countDocuments({}),
    latestUser: await UserModel.findOne({}, 'username', {
      sort: {'created_at': -1},
    }),
  });
};
