const settings = require('../data/settings.json');
const config = require('../data/config.json');
const controller = module.exports;

controller.getSettings = async function(req, res, next) {
  res.status(200).json({
    success: true,
    result: settings,
  });
};

controller.getConfig = async function(req, res, next) {
  res.status(200).json({
    success: true,
    result: config,
  });
};
