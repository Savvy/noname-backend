const {Forum: Model, Category} = require('../models');
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
      res.status(500).send({message: error});
      return;
    }
  });

  const category = await Category.findById(data.category);
  category.forums.push(forum);
  category.save((error, _result) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }
    res.status(200).json({
      success: true,
      message: 'forum_created',
    });
  });
};

controller.get = function(req, res, next) {
  Model.findOne({
    slug: req.params.slug,
  }).sort({
    'order': -1,
    'createdAt': -1,
  }).populate({
    path: 'threads',
    populate: [
      {
        path: 'user',
        select: 'username',
      },
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
        },
      },
    ],
    options: {
      sort: {
        'pinned': -1,
        'order': -1,
        'createdAt': -1,
        'updatedAt': -1,
      },
      limit: 30,
    },
  })
      .populate({
        path: 'recent_thread',
        select: 'user updatedAt',
        populate: {
          path: 'user',
          select: 'username',
        },
      })
      .exec((error, forum) => {
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
        category: -1,
        order: -1,
        createdAt: -1,
      }).exec(function(error, results) {
        if (error) {
          res.status(500).send({message: error});
          return;
        }

        res.status(200).json({success: true, results: results});
      });
};
