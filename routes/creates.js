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
router.get('/show', function(req, res, next) {
  res.send('respond with a resource show');
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

	// var create = new Create();
	// var model = create.newCreate(req);

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
			res.redirect('/creates');
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


/* GET users listing. */
router.post('/update/:id', function(req, res, next) {
	Create.findById(req.params.id, function(err, create){
		if (err){
			console.log("ERROR OCCURED 1 : " , err);
			res.render('creates/edit', {
				create: create,
				form_action_page: "/creates/update/"+create.id,
				form_method_type: "post",
				errors: utils.errors(err.errors || err)
			});
		}
		create.title = req.body.title;
	    create.type = req.body.type;
	    create.advertisers = req.body.advertisers;
		create.video_clickthrough_url = req.body.video_clickthrough_url;
		create.skip = req.body.skip;
		create.save(function(err){
			if (!err) {
		      req.flash('success', 'Successfully updated article!');
		      return res.redirect('/creates/');
			}
			console.log("ERROR OCCURED  2: " , err);
			res.render('creates/edit', {
				create: create,
				form_action_page: "/creates/update/"+create.id,
				form_method_type: "post",
				errors: utils.errors(err.errors || err)
			});
		});
	});
});


router.post('/destroy/:id', function (req, res){
	Create.findById(req.params.id, function (err, create) {
	    create.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('creates/edit', {
					create: create,
					form_method_type: "post",
					errors: utils.errors(err.errors || err)
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
	Create.find(function (err, creates) {
		console.log("calling index.");
		var message = "";
	    if (err){
	    	console.log("ERROR OCCURED 3 : " , err);
	    }
	    if (msg_val != "" && msg_type != ""){
			message = msg_val;
	    }

		res.render('creates/index', {
			creates: creates,
			message_type: msg_type,
			message: message
		});
	});

}


module.exports = router;



