const multer = require('multer');
const path = require('path');
const imagespath = path.join('imagesUplodes');
const stroeg = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, imagespath)
    },
    filename:(req,file, cb)=>{
        cb(null, file.fieldname+"-"+Date.now()+file.originalname)
    }
});
const imageuplodes = multer({storage:stroeg}).single('images')
module.exports = imageuplodes