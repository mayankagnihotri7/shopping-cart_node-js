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

    if (req.session && req.session.userId) {
        User.findById(req.session.userId, "-password", (err,user) => {
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

exports.adminInfo = (req,res,next) => {
    if (req.session.passport) {
        console.log(req.session.passport.user, 'inside admin');
    User.findById(req.session.passport.user, "-password", (err, admin) => {
        console.log(admin, 'finding admin');
        req.adminId = admin;
        res.locals.admin = admin;
        return next();
    });
    } else {
        req.adminId = null;
        res.locals.admin = null;
        return next();
    }
}