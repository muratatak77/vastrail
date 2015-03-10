'use strict'

var express = require('express');
var router = express.Router();
var utils = require('../lib/utils')
var mongoose = require('mongoose');
// jQuery = require('jquery');

var Create = require('../models/create.js');
var message_type =  "";
var message =  "";
var error = "";

/* GET creates listing. */
router.get('/', function(req, res, next) {
	render_index(req, res, "", "");
});

/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	Create.findById(req.params.id, function(err, create){
		console.log("create : " , create);
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}
		res.render('creates/show', {
			create: create
		});
	});

});

/* GET users listing. */
router.get('/new', function(req, res, next) {

	req.flash('success', 'Successfully created create!');

	res.render('creates/new', {
		create: Create,
		form_action_page: "/creates/create",
		form_method_type: "post"
	});
	
});

/* POST create new */
router.post('/create', function(req, res, next){

	console.log("POST: ");
	console.log(req.body);

	var create = Create.new(req);
	console.log("create >> " , create);
	


 	create.save(function (err) {
    	if (err) {
		  	console.log("ERROR OCCURED : " , err);

			return res.render('creates/new', {
				create: create,
				form_action_page: "/creates/create",
				form_method_type: "post",
				errors: utils.errors(err)
			});

    	} else {
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully created create!  / ID = ' + create.id  + " / Title : " + create.title
		    }
			res.redirect('/creates/show/'+create.id);
    	}
  	});

});


/* GET edit by id. */
router.get('/edit/:id', function(req, res, next) {

	Create.findById(req.params.id, function(err, create){
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}
		res.render('creates/edit', {
			create: create,
			form_action_page: "/creates/update/"+create.id,
			form_method_type: "post"
		});
	});

});



router.post('/update/:id', function(req, res, next) {

	console.log("req.params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	Create.findById(req.params.id, function (err, create) {
 	
 		if (err) return next(err);

 		create = Create.load(create, req);

	    create.save(function (err) {

	    	if (!err) {
				req.session.sessionFlash = {
			        type: 'success',
			        message: 'Successfully Update create!  / ID = ' + create.id  + " / Title : " + create.title
			    }
				console.log("Update Successfully :" , create);
		    	return res.redirect('/creates/show/'+create.id);
			}


	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('creates/edit', {
					create: create,
					form_action_page: "/creates/update/"+create.id,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}

    	});
	});


	// Create.findByIdAndUpdate(req.params.id, req.body, function (err, create) {

	//     if (err) return next(err);
	// 	if (!create){
	// 		console.log("ERROR OCCURED 1 : " , 'create is null' );
	// 		return next(err);
	// 	}

	// 	if (!err) {
	// 		req.session.sessionFlash = {
	// 	        type: 'success',
	// 	        message: 'Successfully Update create!  / ID = ' + create.id  + " / Title : " + create.title
	// 	    }
	// 		console.log("Update Successfully :" , create);
	//     	return res.redirect('/creates/show/'+create.id);
	// 	}

	// 	console.log("ERROR OCCURED  : " , err);

	// 	return res.render('creates/edit', {
	// 		create: create,
	// 		form_action_page: "/creates/update/"+create.id,
	// 		form_method_type: "post",
	// 		errors: utils.errors(err)
	// 	});


	// });


});


router.post('/destroy/:id', function (req, res){
	Create.findById(req.params.id, function (err, create) {
	    create.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('creates/edit', {
					create: create,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully destroy create! /  ID = ' + req.params.id  + " / Title : " + create.title
		    }
			res.redirect('/creates');
    	});
	});
});


function render_index(req, res, msg_type, msg_val){

	Create.find({}).populate('user').exec(function(err, creates) { 
		// Your callback code where you can access subdomain directly through custPhone.subdomain.name 

		if (err){
	    	console.log("ERROR OCCURED 3 : " , err);
	    	req.session.sessionFlash = {
		        type: 'danger',
		        message: 'Error Ocuured' + utils.errors(err)
		    }
	    }


	    creates.forEach(function(a,b){
	    	if (a.user != null){
		    	console.log("a : " , a.user.local.email + " /  b  : " + b );
	    	}
	    });

		res.render('creates/index', {
			creates: creates,
			message_type: msg_type,
			message: message
		});

	})


	// Create.find(function (err, creates) {
	// 	console.log("calling index.");
	// 	var message = "";
	//     if (err){
	//     	console.log("ERROR OCCURED 3 : " , err);
	//     }
	//     if (msg_val != "" && msg_type != ""){
	// 		message = msg_val;
	//     }

	// 	res.render('creates/index', {
	// 		creates: creates,
	// 		message_type: msg_type,
	// 		message: message
	// 	});
	// });

}


module.exports = router;



