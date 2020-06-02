let express = require("express");
let router = express.Router();
let multer = require("multer");
let path = require("path");
let User = require("../models/user");
let Product = require('../models/product');

// Multer
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, path.join(__dirname, "../public/images/uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

// Creating Profile.
router.get("/:id/profile", async (req, res, next) => {
  let user = await User.findById(req.params.id);
  res.render("profile", { user });
});

router.post("/:id/profile", upload.single("image"), (req, res, next) => {
  console.log("Body", req.body);
  req.body.image = req.file.filename;
  console.log("file path", shoppingImage);

  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    (err, user) => {
      if (err) return err;
      console.log(user, "user here");
      res.render("profile");
    }
  );
});

// // Updating user profile.
router.get("/:id/profile/edit", async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    res.render("editProfile");
    
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/profile/edit",
  upload.single("image"),
  async (req, res, next) => {

    try {
      console.log(req.file.filename, "hey image.");

      let user = await User.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        image: req.file.filename,
      });

      res.redirect(`/shopping/${user.id}/profile`);

    } catch (error) {
      next(error);
    }
  }
);

// Rendering shopping page if verified.
router.get("/", async (req, res, next) => {
  
  console.log(req.session.userId, "verify router");

  if (req.session && req.session.userId) {

    let product = await Product.find({})
    res.render("shopping", {product});

  } else if (req.session && req.session.passport.user) {
    
    let product = await Product.find({});
    res.render("shopping", { product });

  } else {
    
    console.log('not verified');
    res.render('verifyForm');

  }

});

module.exports = router;
