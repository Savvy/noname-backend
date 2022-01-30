const {Category: Model} = require('../models');
const {slugify} = require('../helpers');
const categories = module.exports;

categories.create = function(req, res, next) {
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
  });
};

categories.getAll = function(req, res, next) {
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
