var express = require("express");
var router = express.Router();
var User = require('../models/user');
let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
let multer = require('multer');
let path = require('path');
let Cart = require('../models/cart');

// Multer
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, path.join(__dirname, "../public/images/uploads"));
},
filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
},
});

var upload = multer({ storage: storage });

/* GET users listing. */
// Register form.
router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post('/register', upload.single("image"), async (req,res,next) => {
  
  // const admins = ["mayankagnihotri7@gmail.com"]

  // Nodemailer
  let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASS,
    },
  }));

  var verification = Math.random().toString(36).slice(2);

  let mailOptions = {
    from: process.env.GMAIL_ID,
    to: req.body.email,
    subject: "This is a test mail.",
    test: "First mail via nodemailer",
    html: `<h1>From nodemailer</h1> ${verification}`,
  };

  req.body.verification = verification;

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(err);
    console.log("Message sent: %", info.response);
  });

  // if(admins.includes(req.body.email)){
  //   req.body.admin = true;
  //   req.body.image = req.file.filename;
  //   let createUser = await User.create(req.body);
  //   console.log(createUser, "registering user");
  // }

  req.body.image = req.file.filename;
  
  let createUser = await User.create(req.body);

  res.render("verifyForm", {createUser});

})

//verification route
router.post('/:email/verify', async(req,res,next) => {

  try{
    var user = await User.findOne({email: req.params.email})
    if (user.verification === req.body.verification) {
      var updateUser = await User.updateOne(
        { email: req.params.email },
        { isVerified: true },
        { new: true }
      );
      res.redirect("/users/login");
    } else if(!user.verification === req.body.verification){
      res.redirect('/users/login');
    }
  }catch(err){
    next(err)
  }
})

// Login form
router.get("/login", (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/shopping");
  }
    res.render("login");
});

router.post('/login', (req,res,next) => {

  let { email, password } = req.body;

    if (!email || !password) {
      return res.redirect("/users/login");
    }

  User.findOne({email}, (err, user) => {

    // handle error
    if (err) return err;
    
    if (!user) {
      return res.redirect('/users/login');
    }

    if (!user.verify(password)) {
      return res.redirect('/users/login');
    }

    if (!user.isVerified) {
      return res.render('verifyForm');
    }

    if (user.isBlock) {
      return res.redirect('/users/login');
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.redirect('/shopping');

  })
})

// Show all users.
router.get('/allUsers', async (req,res,next) => {
  let user = await User.find({});
  res.render('allUsers', {user});
})

// Block user.
router.get('/:id/block', async (req,res,next) => {

  let user = await User.findByIdAndUpdate(req.params.id, {isBlock: true}, {new: true});

  res.redirect('/users/allUsers');

})

// Unblock user.
router.get('/:id/unblock', async (req,res,next) => {

  let user = await User.findByIdAndUpdate(req.params.id, {isBlock: false}, {new: true});

  res.redirect('/users/allUsers');

})

// Logout user.
router.get('/logout', (req,res,next) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/users/login');
})

module.exports = router;
