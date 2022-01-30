module.exports = function(req, res, next) {
  if (!req.user || req.user.status != 'Active') {
    res.status(401).send({error: 'verify_account'});
    return;
  }
  next();
};
