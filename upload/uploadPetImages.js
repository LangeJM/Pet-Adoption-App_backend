const AWS = require('aws-sdk')
const multer = require('multer')

const multerS3 = require('multer-s3')
path = require('path')

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
  
  limits: { fileSize: 1024 * 1024 * 5 }, // In bytes, equals to 5MB
  
  fileFilter: function (req, file, fileTypeVerification) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) return fileTypeVerification(null, true);
    else fileTypeVerification("Only images of type jpeg|jpg|png are allowed!");
  }
});

module.exports = upload  