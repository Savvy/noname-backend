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

  category.save((error, category) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }
    res.json({
      success: true,
      message: 'category_created',
    });
  });
};

controller.getAll = function(req, res, next) {
  Model.find({}, (error, result) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }
    res.json({
      success: true,
      result: result,
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
