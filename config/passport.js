// config/passport.js
var utils = require('../lib/utils')
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
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
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        console.log("signup params : " , req.body);

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err){
                console.log("ERROR OCCURED : " , err);
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                console.log("Validation That email is already taken. : " , email);
                req.session.sessionFlash = { type: 'danger', message: 'That email is already taken.'}
                return done(null, false);
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
                newUser.first_name = req.body.first_name;
                newUser.last_name = req.body.last_name;

                // save the user
                newUser.save(function(err) {
                    console.log("err :" , err);

                    if (err){
                        req.session.sessionFlash = { type: 'danger', message: utils.errors(err)}
                        return done(null, false);
                    }
                    
                    // throw err;
                    return done(null, newUser);
                });
            }

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

         console.log("params :" , req.body);
         var email = req.body.email;
         var pass = req.body.password;

         if (email == '' || pass == '' ){
             req.session.sessionFlash = { type: 'danger', message: 'Email or Password not is empty.'}
             // req.flash('loginMessage', 'Email or Password not is empty.');
             return done(null, false); // req.flash is the way to set flashdata using connect-flash
         }

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else

            if (!email){
                req.session.sessionFlash = { type: 'danger', message: 'Email or Password not is empty.'}
                return done(null, false); // req.flash is the way to set flashdata using connect-flash
            }

            if (err){
                console.log("ERROR OCCURED :" , err);
                return done(err);
            }

            // if no user is found, return the message
            if (!user){
                req.session.sessionFlash = { type: 'danger', message: 'No user found.'}
                return done(null, false); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)){
                req.session.sessionFlash = { type: 'danger', message: 'Oops! Wrong password.'}
                return done(null, false); // create the loginMessage and save it to session as flashdata
            }

            // all is well, return successful user
            req.session.sessionFlash = { type: 'success', message: 'Login successfully!'}
            return done(null, user);
        });

    }));

};