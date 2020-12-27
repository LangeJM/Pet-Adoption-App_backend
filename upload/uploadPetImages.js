const AWS = require('aws-sdk')
const multer = require('multer')

const multerS3 = require('multer-s3')
path = require('path')

// AWS.config.loadFromPath(`${__dirname}/../config/aws-config.json`); // THis is now stored in the .env and automatically recognized by AWS

const S3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: S3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: 'inline',
    acl: 'public-read',
    bucket: 'pet-images-itc',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
    }
  }),
  // SET DEFAULT FILE SIZE UPLOAD LIMIT
  limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
  // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Only images of type jpeg|jpg|png are allowed!");
    }
  }
});


module.exports = upload  