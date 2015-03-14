'use strict'

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');
var flash = require('express-flash');
var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var config = require('./config/config');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;


var jsdom = require("jsdom"); 
var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

var routes = require('./routes/index');
var users = require('./routes/users');
var creates = require('./routes/creates');
var categories = require('./routes/categories');


require('./config/passport')(passport); 
var auth = require('./config/auth');


var env = process.env.NODE_ENV || 'development';
console.log("ENV : " , env);

// var configDB = require('./config/database.js');
mongoose.connect(config.db); // connect to our database

// var  db = mongoose.connect('mongodb://localhost:27017/vast');


var app = express();
var sessionStore = new session.MemoryStore;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('views', __dirname + '/views');

// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser('secret'));

app.use(session({
    cookie: { maxAge: 6000000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'vastrailldghns9705676455342g323ksldfjen8ow59iwr48579'
}));



// app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(function(req, res, next){

    res.locals.user = req.session.user;
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

app.use('/', routes);
app.use('/users', auth.requiresLogin, users);
app.use('/creates', auth.requiresLogin, creates);
app.use('/categories', auth.requiresLogin, categories);

app.use("/style", express.static(__dirname + '/public/stylesheets/'));
app.use("/images", express.static(__dirname + '/public/images/'));
app.use("/js", express.static(__dirname + '/public/javascripts/'));


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
