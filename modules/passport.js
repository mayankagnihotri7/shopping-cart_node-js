let passport = require("passport");
let gitHub = require("passport-github").Strategy;
let User = require("../models/user");

passport.use(
  new gitHub(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      let newUser = {
        username: profile.username,
        email: profile._json.email,
        bio: profile._json.bio,
        photos: profile.photos[0].value,
        id: profile.id,
        admin: profile.admin,
      };

      console.log('new user created.')

      if (newUser.email === "mayankagnihotri7@gmail.com") {
        // done(null, newUser);

        User.findOne({ email: newUser.email }, (err, user) => {
          console.log('user found');
          if (!user) {
            User.create(
              {
                username: profile.username,
                email: profile._json.email,
                bio: profile._json.bio,
                photos: profile.photos[0].value,
                password: process.env.PASSWORD,
                admin: true,
                id: profile.id,
              },
              (err, admin) => {
                done(null, admin);
                console.log('user from passport created.')
              }
            );
          } else done(null, user);
        });
      } else {
        done(null, false);
        console.log('user already created.');
      }
    }
  )
);

// Serialize.
passport.serializeUser((user, done) => {
  console.log("serialize")
  done(null, user._id);
});

// Deserialize.
passport.deserializeUser((id, done) => {
  console.log("deserialize");
  done(null, id);
});
