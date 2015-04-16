var LocalStrategy = require('passport-local').Strategy;
var User = require('../User');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      process.nextTick(function() {
        console.log('Username: ' + username);
        User.findOne({
          'username': username
        }, function(err, user) {
          console.log("Looking for " + username);
          if (err) {
            console.log('error from DB');
            return done(err);
          }
          if (user) {
            console.log('User already exists');
            req.session.messages = ['User already exists'];
            return done(null, false);
          } else {
            console.log('Adding a new user');
            var newUser = new User();
            newUser.username = username;
            newUser.hashed_password = password;
            newUser.save(function(err) {
              if (err) {
                console.log('Error saving user');
                return console.error(err);
              }
              return done(null, newUser);
            });
          }
        });
      });
    }
  ));


  passport.use('local-login', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      User.findOne({
        'username': username
      }, function(err, user) {
        if (err) {
          console.log('There was an error in the database');
          return done(err);
        }

        if (!user) {
          console.log('Could not find user: ' + username);
          req.session.messages = ['User does not exist'];
          return done(null, false);
        }

        if (!user.validPassword(password)) {
          console.log('Invalid password');
          req.session.messages = ['Incorrect password'];
          return done(null, false);
        }
        //console.log(user);
        return done(null, user);
      });
    }));

};