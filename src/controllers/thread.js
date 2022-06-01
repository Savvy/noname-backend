const {Thread: Model, Forum, Post} = require('../models');
const settings = require('../data/settings.json');
const {logsnag} = require('../helpers');
const controller = module.exports;

controller.create = async function(req, res, next) {
  const data = req.body;
  let thread = new Model({
    forum: data.forum,
    title: data.title,
    pinned: data.pinned,
    user: req.user._id,
  });

  let post = new Post({
    user: req.user._id,
    content: data.content,
    thread: data.thread,
  });

  thread.posts.push(post);

  try {
    post = await post.save();
    thread = await thread.save();
  } catch (error) {
    return next(error);
  }

  const forum = await Forum.findById(data.forum);
  forum.threads.push(thread);
  forum.recent_thread = thread;
  forum.save((error, _) => {
    if (error) {
      return next(error);
    }
    logsnag.publish({
      ...logsnag.EVENTS.THREAD_CREATED,
      description: `${thread.title} created by ${req.user.username}`,
    });
    res.status(200).json({
      success: true,
      message: 'thread_created',
      thread: thread.threadId,
    });
  });
};

controller.get = async function(req, res, next) {
  const page = +req.params.page || 1;
  const perPage = 15;

  Model.findOne({
    threadId: req.params.id,
  }).populate({
    path: 'user',
    select: 'username',
    populate: {
      path: 'details role',
    },
  }).populate({
    path: 'posts',
    limit: perPage,
    skip: (page - 1) * perPage,
    populate: {
      path: 'user',
      populate: {
        path: 'details role',
      },
    },
  }).populate({
    path: 'forum',
    select: 'name slug',
  }).sort({
    'updatedAt': -1,
    'createdAt': -1,
  }).exec(async (error, result) => {
    if (error) {
      return next(error);
    }

    if (!result) {
      res.status(400).send({message: 'forum_not_found'});
      return;
    }

    const postCount = await Post.countDocuments({thread: result._id});

    res.status(200).json({
      success: true,
      result: result,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalCount: postCount || 0,
        totalPages: Math.ceil(postCount / perPage) || 1,
      },
    });
  });
};

controller.getAll = function(req, res, next) {
  Model.find({})
      .sort({
        pinned: -1,
        forum: -1,
        createdAt: -1,
      }).limit(30).exec(function(error, results) {
        if (error) {
          return next(error);
        }
        res.status(200).json({success: true, results: results});
      });
};

controller.recentThreads = async function(req, res, next) {
  const page = +req.params.page || 1;
  const perPage = settings.recentThreadsMax;
  const count = await Model.countDocuments({});
  Model.find({}).sort({
    createdAt: -1,
  }).populate({
    path: 'user',
    select: 'username',
    populate: {
      path: 'details role',
    },
  }).populate({
    path: 'posts',
    populate: {
      path: 'user',
      select: 'username',
      populate: {
        path: 'details role',
      },
    },
  })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .exec(function(error, results) {
        if (error) {
          return next(error);
        }
        res.status(200).json({
          success: true,
          results: results,
          pagination: {
            currentPage: page,
            perPage: perPage,
            totalCount: count || 0,
            totalPages: Math.ceil(count / perPage) || 1,
          },
        });
      });
};
