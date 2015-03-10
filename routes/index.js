var express = require('express');
var router = express.Router();
var passport = require('passport')


/* GET home page. */
router.get('/', function(req, res, next) {

	console.log("idnexxxxx");

	res.render('index', { expressFlash: req.flash('	'), sessionFlash: res.locals.sessionFlash });
  // res.render('index', { title: 'Express' });
});


// =====================================
// LOGIN ===============================
// =====================================
// show the login form
router.get('/login', function(req, res) {
	console.log("Calling GET Login");

    res.render('users/login', {
    	message: req.flash('loginMessage')
 	});

});


// // process the login form
// router.post('/login', passport.authenticate('local-login', {

// 	successRedirect : '/', // redirect to the secure profile section
// 	failureRedirect : '/login', // redirect back to the signup page if there is an error
// 	failureFlash : true // allow flash messages
// }));

// router.post('/login', passport.authenticate('local-login', {
//     successRedirect : '/', // redirect to the secure profile section
//     failureRedirect : '/login', // redirect back to the signup page if there is an error
//     failureFlash : true // allow flash messages
// }));


// process the login form
router.post('/login', function(req, res, next) { 
	loginPost(req, res, next);
	// return passport.authenticate('local-login', { 

	// 	successRedirect : '/', // redirect to the secure profile section
	// 	failureRedirect : '/login', // redirect back to the signup page if there is an error
	// 	failureFlash : true // allow flash messages
	// });

});

function loginPost(req, res, next) {
  // ask passport to authenticate
	passport.authenticate('local-login', function(err, user, info) {
     
	  	console.log("params :" , req.body);
	  	var email = req.body.email;
	  	var pass = req.body.password;

	  	if (email == '' || pass == '' ){
	  		req.session.sessionFlash = { type: 'danger', message: 'Email or Password not is empty.'}
	  		// req.flash('loginMessage', 'Email or Password not is empty.');
	      	return res.redirect('/login');
	  	}

	    if (err) {
	      return next(err);
	    }
	   
	    if (!user) {
	      req.flash('success', 'User not found!');
	      return res.redirect('/login');
	    }

	    // if everything's OK
	    req.logIn(user, function(err) {
	     	if (err) {
	        	return next(err);
	    	}
	    	req.session.user = user;

	    	console.log("req.session() : " , req.session );

	    	req.session.login = req.isAuthenticated();

	    	console.log("req.session.login : " , req.session.login);

			req.session.sessionFlash = { type: 'success', message: 'Login successfully!'}
		    return res.redirect('/');
    	});
    
  })(req, res, next);
}


// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
	console.log("Calling Login");
    req.logout();
    res.redirect('/login');
});


// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('users/signup', { message: req.flash('signupMessage') });
});


router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/login',
		failureRedirect: '/signup',
		failureFlash: true 
	})
);

module.exports = router;
