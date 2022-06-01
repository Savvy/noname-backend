const {Post: Model, Thread} = require('../models');
const {logsnag} = require('../helpers');
const controller = module.exports;

controller.create = async function(req, res, next) {
  const data = req.body;
  let post = new Model({
    user: req.user._id,
    content: data.content,
    thread: data.thread,
  });

  try {
    post = await post.save();
  } catch (error) {
    return next(error);
  }

  const thread = await Thread.findById(data.thread);
  thread.posts.push(post);
  thread.save((error, _) => {
    if (error) {
      return next(error);
    }

    logsnag.publish({
      ...logsnag.EVENTS.THREAD_POST,
      description: `${req.user.username} replied to thread ${thread.title}`,
    });

    res.status(200).json({
      success: true,
      message: 'post_created',
      post: post.postId,
    });
  });
};
