let express = require('express');
let router = express.Router();
let multer = require('multer');
let path = require('path');
let User = require('../models/user');

// Multer
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, callBack) => {
    callBack(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

// Creating Profile.
router.get('/:id/profile', async (req,res, next) => {
    let user = await User.findById(req.params.id);
    res.render('profile', {user});
})

router.post("/:id/profile", upload.single("image"), (req, res, next) => {
  console.log("Body", req.body);
  let shoppingImage = req.body;
  shoppingImage.image = req.file.filename;
  console.log("file path", shoppingImage);
  
  User.findByIdAndUpdate(req.params.id, shoppingImage, (err, user) => {
      if (err) return err;
      console.log(user, 'user here');
      res.render('profile');
  })

});

// Rendering shopping page if verified.
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