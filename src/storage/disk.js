const multer = require('multer');
const fs = require('fs');

const UPLOAD_DIR = './src/public/avatars';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, {recursive: true});
}

module.exports = multer.diskStorage({
  destination: function(req, file, next) {
    next(null, UPLOAD_DIR);
  },
  filename: function(req, file, next) {
    const ext = file.mimetype.split('/')[1];
    next(null, `${req.user._id}.${ext}`);
  },
});
