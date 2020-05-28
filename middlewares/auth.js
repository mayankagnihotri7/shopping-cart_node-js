let User = require('../models/user');
let passport = require('passport');

exports.checkLogged = (req,res,next) => {
    console.log('in middlewares')
    
    if (req.session.userId || req.session.passport) {
      console.log(req.session, "inside checking logged.");
      return next();
    } else {
        console.log('inside else condtions')
      return res.redirect("/users/login");
    }
}

exports.userInfo = (req,res,next) => {

    if (req.passport.session) {
        req.session.userId = req.session.passport.user;
        console.log(req.session, 'inside user info');
    }

    if (req.session && req.session.userId) {
        User.findById(req.session.userId,(err, user) => {
            console.log(user, 'inside session')
        })
    }
}