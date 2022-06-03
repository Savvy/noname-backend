const multerS3 = require('multer-s3');
const {S3Client} = require('@aws-sdk/client-s3');

const S3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_S3_REGION,
});

module.exports = multerS3({
  s3: S3,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  acl: 'public-read',
  key: function(req, file, next) {
    const ext = file.mimetype.split('/')[1];
    next(null, `${req.user._id}.${ext}`);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
