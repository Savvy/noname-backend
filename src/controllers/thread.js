const {Thread: Model, Forum} = require('../models');
const {slugify} = require('../helpers');
const controller = module.exports;

controller.create = async function(req, res, next) {
  const data = req.body;
  const thread = new Model({
    forum: data.forum,
    title: data.title,
    /* slug: slugify(data.title), */
    content: data.content ? data.content : '',
    pinned: data.pinned,
    user: req.user._id,
  });

  thread.save((error, _thread) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }
  });

  const forum = await Forum.findById(data.forum);
  forum.threads.push(thread);
  forum.recent_thread = thread;
  forum.save((error, _result) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }
    res.status(200).json({
      success: true,
      message: 'thread_created',
    });
  });
};

controller.get = function(req, res, next) {
  Model.findOne({
    threadId: req.params.id,
  }).populate({
    path: 'user',
    select: 'username'
  }).populate({
    path: 'posts',
  }).sort({
    'updatedAt': -1,
    'createdAt': -1,
  }).exec((error, forum) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }

    if (!forum) {
      res.status(400).send({message: 'forum_not_found'});
      return;
    }
    res.status(200).json({success: true, result: forum});
  });
};

controller.getAll = function(req, res, next) {
  Model.find({})
      .sort({
        pinned: -1,
        forum: -1,
        order: -1,
        createdAt: -1,
      }).limit(30).exec(function(error, results) {
        if (error) {
          res.status(500).send({message: error});
          return;
        }

        res.status(200).json({success: true, results: results});
      });
};
