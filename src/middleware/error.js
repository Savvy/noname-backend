const error = module.exports;

error.logger = function(err, req, res, next) {
  console.error('\x1b[31m', err);
  next(err);
};

error.responder = function(err, req, res, next) {
  res.header('Content-Type', 'application/json');
  res.status(err.statusCode).send(JSON.stringify(err, null, 4));
};
