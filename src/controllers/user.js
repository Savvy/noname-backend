const {User: Model} = require('../models');
const controller = module.exports;


controller.get = function(req, res, next) {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

controller.update = async function(req, res, next) {
  const update = req.body;
  const filter = {username: req.params.username};
  const user = await Model.findOneAndUpdate(filter, update, {new: true});

  return res.status(200).send(user);
};
