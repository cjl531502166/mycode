var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/upload');
    },
    filename: (req, file, cb) => {
        var ext = file.originalname.replace(/^.+\./, '');
        cb(null, `${file.fieldname}_${Date.now()}.${ext}`);
    }
});
var upload = multer({ storage: storage });
module.exports = upload;