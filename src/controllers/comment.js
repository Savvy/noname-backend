const {Comment: Model} = require('../models');
const controller = module.exports;

controller.delete = async function(req, res, next) {
  try {
    const comment = await Model.findById(req.body.id);
    if (!comment) {
      res.status(404).send({message: 'comment_not_found'});
      return;
    }

    if (comment.author !== req.user._id) {
      res.status(403).send({message: 'no_permission'});
      return;
    }

    await comment.delete();
    res.status(200).json({
      success: true,
      message: 'comment_deleted',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

controller.like = async function(req, res, next) {
  const data = req.body;
  console.log(data);
  try {
    const comment = await Model.findById(data.id);
    if (!comment) {
      // Comment does not exist;
      return;
    }

    if (comment.like.includes(req.user._id)) {
      console.log('User has unliked the post');
      comment.like.pull(req.user._id);
      await comment.save();
      res.status(200).json({
        success: true,
        message: 'comment_unliked',
      });
      return;
    }

    comment.like.push(req.user);
    await comment.save();
    res.status(200).json({
      success: true,
      message: 'comment_liked',
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

controller.create = async function(req, res, next) {
  const data = req.body;
  try {
    const comment = new Model({
      user: data.user,
      author: data.author,
      reply: data.parent !== undefined && data.parent !== null,
      content: data.content,
    });

    const result = await comment.save();

    if (data.parent) {
      const parent = await Model.findById(data.parent);
      parent.children.push(result);
      await parent.save();
    }

    res.status(200).json({
      success: true,
      result: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
