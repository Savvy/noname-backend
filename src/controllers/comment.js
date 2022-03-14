const {Comment: Model} = require('../models');
const controller = module.exports;

controller.delete = async function(req, res, next) {
  try {
    await Model.findByIdAndDelete(req.body.id);
    res.status(200).json({
      success: true,
      message: 'comment_deleted',
    });
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
