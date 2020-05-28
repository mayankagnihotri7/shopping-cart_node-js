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
      console.log(profile, 'profile');
      let newUser = {
          username : profile.username,
          email: profile._json.email,
          bio: profile._json.bio,
          photos: profile.photos[0].value,
          id: profile.id
      }
      
      if (newUser.email === "mayankagnihotri7@gmail.com") {

        done(null, newUser)

          User.findOne({email: newUser.email}, (err, user) => {

              if(!user){

                  User.create({
                    username: profile.username,
                    email: profile._json.email,
                    bio: profile._json.bio,
                    photos: profile.photos[0].value,
                    password: process.env.PASSWORD,
                    admin: true,
                    id: profile.id
                  },(err, admin) => {
                    
                    done(null, admin);
                    console.log(admin,'admin here');

                  });
              }
          })

      } else {
          done(null, false);
      }

    }
  )
);

// Serialize.
passport.serializeUser((user, done) => {
    console.log(user, 'inside serialize.');
    done(null, user);
})

// Deserialize.
passport.deserializeUser((id,done) => {
    console.log(id, 'inside deserialize');
    done(null, id);
})