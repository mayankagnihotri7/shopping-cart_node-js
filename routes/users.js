var express = require("express");
var router = express.Router();
var User = require('../models/user');
let auth = require('../middlewares/auth');
let nodemailer = require('nodemailer');



/* GET users listing. */
// Register form.
router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post('/register', async (req,res,next) => {
  
  const admins = ["mayankagnihotri7@gmail.com"]


  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3f1c7c85db0c99",
      pass: "4cc539e9768473",
    },
  });

  var verification = Math.random().toString(36).slice(2);

  let mailOptions = {
    from: "from@example.com",
    to: req.body.email,
    subject: "This is a test mail.",
    test: "First mail via nodemailer",
    html: `<h1>From nodemailer</h1> ${verification}`,
  };
  req.body.verification = verification;
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(err);
    console.log("Message sent: %", info.messageId);
  });

  if(admins.includes(req.body.email)){
    req.body.admin = true;
  let createUser = await User.create(req.body);
    console.log(createUser, "registering user");
  }

  let createUser = await User.create(req.body);
  console.log(createUser, 'registering user');
  res.render('login');

})

//verification route
router.post('/:email/verify', async(req,res) => {
  try{
    var user = await User.findOne({email: req.params.email})
    if (user.verification === req.body.verification) {
      var updateUser = await User.updateOne(
        { email: req.params.email },
        { isVerified: true },
        { new: true }
      );
      res.redirect("/shopping")
    } 
    if(user.verification === req.body.verification){
      res.send("not verified")
    }
  }catch(err){
    res.send(err)
    console.log(err)
  }
})

// Login form
router.get("/login", (req, res, next) => {
  console.log(req.userId,"from login route")
  if(req.userId){
    return res.render("shopping")
  }
  res.render("login");
});

router.post('/login', (req,res,next) => {
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
