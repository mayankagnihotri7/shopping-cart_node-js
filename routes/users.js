var express = require("express");
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
// Register form.
router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post('/register', async (req,res,next) => {
  let createUser = await User.create(req.body);
  console.log(createUser, 'registering user');
  res.render('login');
})

// Login form
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post('/login', async (req,res,next) => {
  console.log('Inside login page.');
})

module.exports = router;
