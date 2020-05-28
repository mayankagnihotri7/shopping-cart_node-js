let User = require('../models/user');
let passport = require('passport');

exports.checkLogged = (req,res,next) => {
    console.log('in middlewares')
    
    if (req.session && req.session.userId) {
      console.log(req.session, "inside checking logged.");
      return next();
    } else {
        console.log('inside else condtions')
      return res.redirect("/users/login")
    }
}

exports.userInfo = (req,res,next) => {

    if (req.session.passport) {
        req.session.userId = req.session.passport.user;
        console.log('inside passport')
        next()
    }

    if (req.session.userId) {
        User.findById(req.session.userId, "-password", (err,user) => {
            console.log(user, 'inside auth');
            req.userId = user;
            res.locals.user = user;
                    next();

        })
    } else {
        req.userId = null;
        res.locals.user = null;
        next()
    }
}