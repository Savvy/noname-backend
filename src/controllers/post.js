const {Post: Model, Thread} = require('../models');
/* const {slugify} = require('../helpers'); */
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
    res.status(500).send({message: error});
    return;
  }

  const thread = await Thread.findById(data.thread);
  thread.posts.push(post);
  thread.save((error, _) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }
    res.status(200).json({
      success: true,
      message: 'post_created',
      post: post.postId,
    });
  });
};
