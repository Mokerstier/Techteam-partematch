const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {userSchema} = require('../models/user');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const bcrypt = require('bcrypt');

module.exports = function(passport){

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function(username, password, done){
        let auth = {username: username};
        userSchema.findOne(auth, function(err, user){
            if (err) throw err;
            if (!user){
                return done (null, false, {message: 'No user found'});
            }

            bcrypt.compare(password, user.password, function(err, authSucces){
                if(err) throw err;
                if(authSucces){
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}