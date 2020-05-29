let express = require('express');
let router = express.Router();
let multer = require('multer');
let path = require('path');
let helpers = require('./helpers');

let storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, 'uploads/');
    },
    
    // Adding file extensions back because multer removes them.
    filename: function(req,file,cb) {
        cb (null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

router.post("/upload-profile-pic", (req,res) => {
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter}).single('profile-pic');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields

        if (req.fileValidationError) {
            return res.send(file.fileValidationError);
        } else if (!res.file) {
            return res.send("Please select an image to upload.");
        } else if ( err instanceof multer.MulterError ) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation.
        res.send(
          `You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`
        );
    })
});

router.get('/', (req,res,next) => {
    if(!req.userId.isVerified){
        console.log("user not verified");
    //    return res.send("please verify first")
       return res.render("verifyForm",{email:req.userId.email})
    }
    console.log("inside profile router.", req.userId.isVerified);
    res.render('shopping');
    
})

module.exports = router;