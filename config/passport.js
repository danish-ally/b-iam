const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

// const keys = require('./keys');


const User = mongoose.model('User');
const accessSecret = process.env.JWT_SECRET_ACCESS;
// const refreshSecret = process.env.JWT_SECRET_ACCESS;


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = accessSecret;

// const opts2 = {};
// opts2.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts2.secretOrKey = refreshSecret;

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    User.findById(payload.id)
      .then(user => {
        if (user) {
          return done(null, user);
        }

        return done(null, false);
      })
      .catch(err => {
        return done(err, false);
      });
  })
);

// passport.use(
//   new JwtStrategy(opts2, (payload, done) => {
//     User.findById(payload.id)
//       .then(user => {
//         if (user) {
//           return done(null, user);
//         }

//         return done(null, false);
//       })
//       .catch(err => {
//         return done(err, false);
//       });
//   })
// );
