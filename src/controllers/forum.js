const {Forum: Model, Thread, Category} = require('../models');
const {slugify} = require('../helpers');
const controller = module.exports;

controller.create = async function(req, res, next) {
  const data = req.body;
  const forum = new Model({
    category: data.category,
    name: data.name,
    slug: slugify(data.name),
    description: data.description ? data.description : '',
    parent: data.parent ? data.parent : null,
    redirect: data.redirect ? data.redirect : false,
    redirect_url: data.redirect_url ? data.redirect_url : '',
    icon: data.icon ? data.icon : '',
    order: data.order ? data.order : 0,
  });

  forum.save((error, _forum) => {
    if (error) {
      return next(error);
    }
  });

  const category = await Category.findById(data.category);
  category.forums.push(forum);
  category.save((error, _result) => {
    if (error) {
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: 'forum_created',
    });
  });
};

controller.get = async function(req, res, next) {
  const page = +req.params.page || 1;
  const perPage = 15;
  const forumId = await Model.findOne({
    slug: req.params.slug,
  }).select('_id');
  const threadCount = await Thread.find({forum: forumId}).countDocuments();
  const threads = await Thread.find({forum: forumId}).populate([
    {path: 'user', select: 'username', populate: {path: 'details'}},
    {
      path: 'posts',
      options: {
        sort: {
          'createdAt': -1,
          'updatedAt': -1,
        },
      },
      populate: {
        path: 'user',
        select: 'username',
        populate: {
          path: 'details',
        },
      },
    },
  ]).sort({
    'pinned': -1,
    'order': -1,
    'createdAt': -1,
    'updatedAt': -1,
  }).limit(perPage).skip((page - 1) * perPage);
  Model.findOne({
    slug: req.params.slug,
  }).sort({
    'order': -1,
    'createdAt': -1,
  }).populate({
    path: 'recent_thread',
    select: 'user updatedAt',
    populate: {
      path: 'user',
      select: 'username',
    },
  }).exec((error, forum) => {
    if (error) {
      return next(error);
    }

    if (!forum) {
      res.status(400).send({message: 'forum_not_found'});
      return;
    }
    forum.threads = threads;
    res.status(200).json({
      success: true,
      result: forum,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalCount: threadCount,
        totalPages: Math.ceil(threadCount / perPage) || 1,
      },
    });
  });
};

controller.getAll = function(req, res, next) {
  Model.find({})
      .sort({
        category: -1,
        order: -1,
        createdAt: -1,
      }).exec(function(error, results) {
        if (error) {
          return next(error);
        }

        res.status(200).json({success: true, results: results});
      });
};
