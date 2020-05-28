var express = require("express");
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Handle request.
router.get("/auth/github", passport.authenticate("github"));

// Handle success or failure conditions.
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/users/login" }),
  (req, res) => {
    console.log(req.user, "inside github auth");
    res.redirect('/shopping');
  }
);

module.exports = router;
