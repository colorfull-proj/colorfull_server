const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.loadFromPath(__dirname + '/../config/s3.json');

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'colorfull-bucket',
        acl: 'public-read',
        key: (req, file, cb) => {
            // TODO 여기서 파일이 없을때 체크..? 그냥 controller에서 하는게 나을듯 싶음! (업로드가 안되면!)
            if (!file) {
                console.log('no file')
                return;
            }
            cb(null, Date.now() + '_' + file.originalname);
        }
    })
});

module.exports = upload;