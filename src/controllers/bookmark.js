const {Bookmark: Model, Post} = require('../models');

const controller = module.exports;

controller.add = async function(req, res, next) {
  const postId = req.body.postId;

  if (!postId) {
    return res.status(400).send({message: 'post_required'});
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).send({message: 'post_not_found'});
    }

    let doc = await Model.findOne({user: req.user, post: post});

    if (doc) {
      return res.status(400).send({message: 'bookmark_exists'});
    }

    doc = new Model({
      user: req.user,
      post: postId,
    });

    await doc.save();
    return res.status(200).json({
      success: true,
      message: 'bookmark_created',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({message: error});
  }
};

controller.get = async function(req, res, next) {
  const page = +req.params.page || 1;
  const perPage = 15;
  try {
    const count = await Model.countDocuments({user: req.user});
    const results = await Model.find({user: req.user})
        .populate('post')
        .limit(perPage).skip((page - 1) * perPage);
    res.status(200).json({
      success: true,
      result: results,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalCount: count,
        totalPages: Math.ceil(count / perPage) || 1,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({message: error});
  }
};
