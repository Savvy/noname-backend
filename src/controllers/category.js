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
      res.status(500).send({message: error});
      return;
    }
    res.status(200).json({
      success: true,
      message: 'category_created',
    });
  });
};

controller.getAll = function(req, res, next) {
  Model.find({}).populate({
    path: 'forums',
    select: ['name', 'slug', 'redirect',
      'redirect_url', 'order', 'recent_thread', 'icon'],
    populate: {
      path: 'recent_thread',
      populate: {
        path: 'user',
        select: 'username',
        populate: {
          path: 'details',
        },
      },
    },
  }).exec(function(error, results) {
    if (error) {
      res.status(500).send({message: error});
      return;
    }

    res.json({
      success: true,
      result: results,
    });
  });
};

controller.delete = function(req, res, next) {
  Model.deleteOne({
    _id: req.body._id,
  }, (error) => {
    if (error) {
      res.status(500).send({message: error});
      return;
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
