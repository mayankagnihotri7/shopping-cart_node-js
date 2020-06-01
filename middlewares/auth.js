let User = require('../models/user');
let passport = require('passport');

exports.checkLogged = (req,res,next) => {
    console.log("inside checking logged.");
    
    if (req.session && req.session.userId) {
      return next();
    } else if (req.session.passport) {
        return next();
    } else {
        console.log('inside checking logged else condition');
     return res.redirect("/users/login");
    }
}

exports.userInfo = (req,res,next) => {

    if (req.session.passport) {
        req.session.userId = req.session.passport.user;
        console.log(req.session.userId, "inside user info");
      return  next();
    } else if (req.session.userId) {
        User.findById(req.session.userId, "-password", (err,user) => {
            console.log(user, 'inside auth');
            req.userId = user;
            res.locals.user = user;
            return next();

        })
    } else {
        req.userId = null;
        res.locals.user = null;
       return next()
    }
}