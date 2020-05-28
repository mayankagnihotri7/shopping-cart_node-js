var express = require("express");
var router = express.Router();
var User = require('../models/user');
let auth = require('../middlewares/auth');

/* GET users listing. */
// Register form.
router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post('/register', async (req,res,next) => {
  
  const admins = ["mayankagnihotri7@gmail.com"]

  if(admins.includes(req.body.email)){
    req.body.admin = true;
  let createUser = await User.create(req.body);
    console.log(createUser, "registering user");
  }

  let createUser = await User.create(req.body);
  console.log(createUser, 'registering user');
  res.render('login');

})

// Login form
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post('/login', (req,res,next) => {
  let { email, password, username } = req.body;
  User.findOne({email}, (err, user) => {
    
    req.session.userId = user.id;
    req.session.username = user.username;
    console.log(req.session, 'inside findone of login.');
    res.render('shopping');
  })
})

module.exports = router;
