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
  console.log('get for register')
  res.render("register");
});

router.post('/register', upload.single("image"), async (req,res,next) => {
  
  const admins = ["mayankagnihotri7@gmail.com"]

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

  if(admins.includes(req.body.email)){
    req.body.admin = true;
    req.body.image = req.file.filename;
    let createUser = await User.create(req.body);
    console.log(createUser, "registering user");
  }

  req.body.image = req.file.filename;
  
  let createUser = await User.create(req.body);
  console.log(createUser, 'registering user');

  let cart = await Cart.create({userId: createUser.id});
  console.log(cart, 'inside cart');

  let updatedUser = await User.findByIdAndUpdate(createUser.id, {cart: cart.userId}, {new:true});
  console.log(updatedUser, 'updating user');

  console.log('post register');
  res.render('login');

})

//verification route
router.post('/:email/verify', async(req,res,next) => {
  console.log('verify router');
  try{
    var user = await User.findOne({email: req.params.email})
    console.log(user, 'finding user');
    if (user.verification === req.body.verification) {
      var updateUser = await User.updateOne(
        { email: req.params.email },
        { isVerified: true },
        { new: true }
      );
      res.redirect("/shopping")
    } else if(!user.verification === req.body.verification){
      console.log('verify router fail.')
      res.send("not verified")
    }
  }catch(err){
    next(err)
    console.log(err)
  }
})

// Login form
router.get("/login", (req, res, next) => {
  console.log('get login form')
  if (req.session.userId) {
    return res.render("shopping");
  }
    res.render("login");
});

router.post('/login', (req,res,next) => {
  console.log('post login router');
  let { email, password, username } = req.body;
  User.findOne({email}, (err, user) => {
    
    req.session.userId = user.id;
    req.session.username = user.username;
    console.log(req.session, 'inside findone of login.');
    res.redirect('/shopping');
  })
})

// Logout user.
router.get('/logout', (req,res,next) => {
  if (req.session.userId) {
    console.log(req.session, 'inside logout')
    req.session.destroy(function (err) {
      if (err) return res.redirect('/users/login');
      return res.redirect('/users/login');
    })
  }
})

module.exports = router;
