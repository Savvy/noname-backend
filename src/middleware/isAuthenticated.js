module.exports = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(401).send({message: 'not_authenticated'});
    return;
  }
  next();
};
