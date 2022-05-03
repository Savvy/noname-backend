const {Category: Model} = require('../models');
const {slugify} = require('../helpers');
const controller = module.exports;

controller.create = function(req, res, next) {
  const data = req.body;
  const category = new Model({
    name: data.name,
    slug: slugify(data.name),
    description: data.description ? data.description : '',
    hidden: data.hidden,
    order: data.order ? data.order : 0,
  });

  category.save((error, _category) => {
    if (error) {
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: 'category_created',
    });
  });
};

controller.getAll = async function(req, res, next) {
  try {
    const results = await Model.find({}).populate({
      path: 'forums',
      populate: [{
        path: 'recent_thread',
        populate: {
          path: 'user',
          select: 'username',
          populate: {
            path: 'details',
          },
        },
      }, {
        path: 'threads',
        populate: {
          path: 'user',
          select: 'username',
          populate: {
            path: 'details',
          },
        },
      }],
    });
    res.json({
      success: true,
      result: results,
    });
  } catch (error) {
    next(error);
  }
};

controller.delete = function(req, res, next) {
  Model.deleteOne({
    _id: req.body._id,
  }, (error) => {
    if (error) {
      return next(error);
    }

    res.json({
      success: true,
      message: 'category_deleted',
    });
  });
};

controller.update = async function(req, res, next) {
  const update = req.body;
  const filter = {_id: req.params._id};
  const category = await Model.findOneAndUpdate(filter, update, {new: true});

  return res.status(200).send(category);
};
