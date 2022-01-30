module.exports = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(401).send({error: 'not_authenticated'});
    return;
  }
  next();
};
