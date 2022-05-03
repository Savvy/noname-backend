const error = module.exports;

error.logger = function(err, req, res, next) {
  console.error('\x1b[31m', err);
  next(err);
};

error.responder = function(err, req, res, next) {
  if (process.env.SENTRY_LOGGING) {
    res.statusCode = 500;
    res.end(res.sentry + '\n');
    return;
  }
  res.header('Content-Type', 'application/json');
  res.status(err).send(JSON.stringify(err, null, 4));
};
